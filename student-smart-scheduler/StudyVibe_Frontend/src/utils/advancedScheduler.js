import dayjs from "dayjs";

/**
 * Converts decimal hours to hours and minutes, rounded to nearest 5 minutes
 */
function roundToNearestFiveMinutes(decimalHours) {
  const totalMinutes = Math.round(decimalHours * 60);
  const roundedMinutes = Math.round(totalMinutes / 5) * 5;

  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;

  return { hours, minutes };
}

/**
 * Formats time object to readable string
 */
function formatTime(time) {
  const { hours, minutes } = time;

  if (hours === 0 && minutes === 0) {
    return "0 min";
  }

  let result = "";
  if (hours > 0) {
    result += `${hours} hr`;
  }
  if (minutes > 0) {
    if (result) result += " ";
    result += `${minutes} min`;
  }

  return result;
}

/**
 * Determine the preferred start hour based on user preferences
 * Returns the hour (0-23) when study session should start
 */
function getPreferredStartHour(preferences, sessionIndex = 0) {
  if (!preferences?.preferredTimes || preferences.preferredTimes.length === 0) {
    // Default: start at 8 AM
    return 8;
  }

  // Map preferred time slots to hour ranges
  const timeSlots = {
    "Early Morning (5-8 AM)": [5, 6, 7],
    "Morning (8-12 PM)": [8, 9, 10, 11],
    "Afternoon (12-5 PM)": [12, 13, 14, 15, 16],
    "Evening (5-9 PM)": [17, 18, 19, 20],
    "Night (9 PM+)": [21, 22, 23],
  };

  // Collect all preferred hours
  let preferredHours = [];
  preferences.preferredTimes.forEach((timeStr) => {
    if (timeSlots[timeStr]) {
      preferredHours = preferredHours.concat(timeSlots[timeStr]);
    }
  });

  if (preferredHours.length === 0) {
    return 8; // Default fallback
  }

  // Sort hours chronologically
  preferredHours.sort((a, b) => a - b);

  // Return the appropriate hour based on session index
  // This spreads sessions across preferred time slots
  return preferredHours[sessionIndex % preferredHours.length];
}

/**
 * Calculate available study hours for each day based on schedule and commitments
 */
function calculateDailyAvailableHours(
  schedule,
  commitments,
  preferences,
  dayOfWeek
) {
  const dayName = dayOfWeek;
  const dayShort = dayOfWeek.substring(0, 3);

  // Start with 24 hours
  let availableHours = 24;

  // Subtract sleep hours
  if (preferences?.sleepSchedule) {
    const { start, end } = preferences.sleepSchedule;
    if (start > end) {
      // Sleep crosses midnight (e.g., 23:00 to 7:00)
      availableHours -= 24 - start + end;
    } else {
      availableHours -= end - start;
    }
  }

  // Subtract scheduled blocks from manual input (class, commitment, sleep blocks)
  if (schedule && typeof schedule === "object") {
    Object.entries(schedule).forEach(([key, block]) => {
      // Key format: "Monday-8" or similar
      const [blockDay, blockHour] = key.split("-");
      if (blockDay === dayName && block && block.type) {
        // Count all non-free blocks (class, commitment, sleep)
        if (block.type !== "free") {
          availableHours -= 1; // Each block is 1 hour
        }
      }
    });
  }

  // Subtract additional commitments from the Commitments tab
  if (commitments && Array.isArray(commitments)) {
    commitments.forEach((commitment) => {
      if (commitment.days && commitment.days.includes(dayShort)) {
        const startHour = parseInt(commitment.startTime.split(":")[0]);
        const endHour = parseInt(commitment.endTime.split(":")[0]);
        const startMin = parseInt(commitment.startTime.split(":")[1] || "0");
        const endMin = parseInt(commitment.endTime.split(":")[1] || "0");

        const duration = endHour - startHour + (endMin - startMin) / 60;
        availableHours -= duration;
      }
    });
  }

  // Ensure we have at least some study time
  availableHours = Math.max(0, availableHours);

  // Account for breaks if using Pomodoro (reduce by 15% for realistic break time)
  if (preferences?.pomodoro && availableHours > 0) {
    const pomodoro = preferences.pomodoro;
    const focusMin = pomodoro.focusDuration || 25;
    const breakMin = pomodoro.breakDuration || 5;

    // Calculate break overhead: break time / focus time
    const breakOverhead = breakMin / focusMin;
    availableHours *= 1 - breakOverhead;
  }

  return Math.max(0, availableHours);
}

/**
 * Generate advanced static study plan based on manual input
 * @param {Array} subjects - Array of subjects with examDate
 * @param {Object} schedule - Manual weekly schedule blocks
 * @param {Array} commitments - Additional commitments
 * @param {Object} preferences - User preferences including Pomodoro settings
 * @param {Number} studyHoursAvailable - Total study hours available per day
 * @returns {Object} Study plan in the format expected by frontend
 */
export function generateAdvancedStaticPlan(
  subjects,
  schedule,
  commitments,
  preferences,
  studyHoursAvailable = 6
) {
  console.log("🔍 Advanced Scheduler Input:", {
    subjects,
    schedule,
    commitments,
    preferences,
    studyHoursAvailable,
  });

  const today = dayjs().startOf("day");
  let plan = {};

  // Validate inputs
  if (!subjects || subjects.length === 0) {
    console.warn("⚠️ No subjects provided");
    return plan;
  }

  // Prepare subjects and normalize exam dates
  let subjectList = subjects.map((sub) => {
    const subjectName = sub.subject || sub.name;
    const difficulty = preferences?.subjectDifficulty?.[subjectName] || 3;

    return {
      ...sub,
      name: subjectName,
      examDate: dayjs(sub.examDate).startOf("day"),
      difficulty: difficulty,
    };
  });

  // Sort by exam date (earliest first)
  subjectList.sort((a, b) => a.examDate.diff(b.examDate));

  // Find the last exam date
  const lastExamDate = subjectList.reduce(
    (latest, sub) => (sub.examDate.isAfter(latest) ? sub.examDate : latest),
    today
  );
  const totalDays = Math.max(1, lastExamDate.diff(today, "day"));

  // Calculate total hours needed based on available study hours per day
  // This distributes the total available study time proportionally among subjects
  const totalAvailableStudyHours = studyHoursAvailable * totalDays;

  // Calculate weight sum based on difficulty for proportional distribution
  const totalDifficultyWeight = subjectList.reduce(
    (sum, sub) => sum + sub.difficulty,
    0
  );

  // Assign hours to each subject proportionally based on difficulty
  subjectList = subjectList.map((sub) => {
    const proportionalHours =
      (sub.difficulty / totalDifficultyWeight) * totalAvailableStudyHours;
    return {
      ...sub,
      totalHoursNeeded: proportionalHours,
    };
  });

  console.log(`📅 Planning for ${totalDays} days until last exam`);
  console.log(
    `⏰ Total available study hours: ${totalAvailableStudyHours} (${studyHoursAvailable}hrs/day × ${totalDays} days)`
  );

  // Map day index to day name
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Track total hours allocated per subject
  const allocatedHours = {};
  subjectList.forEach((sub) => {
    allocatedHours[sub.name] = 0;
  });

  // For each day until the day before the last exam
  for (let d = 0; d < totalDays; d++) {
    const currentDate = today.add(d, "day");
    const dateStr = currentDate.format("DD-MMMM-YYYY");
    const dayOfWeek = dayNames[currentDate.day()];

    // Calculate available hours for this specific day
    const availableHours = calculateDailyAvailableHours(
      schedule,
      commitments,
      preferences,
      dayOfWeek
    );

    console.log(
      `📆 ${dateStr} (${dayOfWeek}): ${availableHours.toFixed(
        2
      )} hours available`
    );

    // Skip if no time available
    if (availableHours <= 0.5) {
      console.log(`⏭️ Skipping ${dateStr} - insufficient time`);
      continue;
    }

    // Get subjects whose exams are still upcoming
    const activeSubjects = subjectList.filter(
      (sub) => sub.examDate.diff(currentDate, "day") > 0
    );

    if (activeSubjects.length === 0) {
      console.log(`✅ No more subjects to study for ${dateStr}`);
      continue;
    }

    // Calculate weights based on multiple factors
    let weights = {};
    let totalWeight = 0;

    activeSubjects.forEach((sub) => {
      const daysLeft = Math.max(1, sub.examDate.diff(currentDate, "day"));
      const hoursRemaining = Math.max(
        0,
        sub.totalHoursNeeded - allocatedHours[sub.name]
      );

      // Skip if subject has received enough hours
      if (hoursRemaining < 0.25) {
        return;
      }

      // Factor 1: Urgency - inverse of days left (closer exam = higher priority)
      const urgencyWeight = 1 / Math.sqrt(daysLeft); // Square root to smooth the curve

      // Factor 2: Difficulty multiplier (harder = more time needed)
      const difficultyMultiplier = sub.difficulty / 3; // Scale: 1-5 difficulty

      // Factor 3: Progress deficit (subjects with less progress get priority)
      const progressRatio = allocatedHours[sub.name] / sub.totalHoursNeeded;
      const progressDeficit = Math.max(0.5, 1 - progressRatio); // Boost subjects falling behind

      // Factor 4: Hours remaining (prioritize subjects that still need time)
      const hoursWeight = Math.sqrt(hoursRemaining);

      // Combine all factors
      let weight =
        urgencyWeight * difficultyMultiplier * progressDeficit * hoursWeight;

      // Factor 5: Day-based bonus (all days get base weight)
      // The actual time slot preference is applied during session creation

      weights[sub.name] = weight;
      totalWeight += weight;

      console.log(
        `  📚 ${sub.name}: weight=${weight.toFixed(
          3
        )}, daysLeft=${daysLeft}, difficulty=${
          sub.difficulty
        }, remaining=${hoursRemaining.toFixed(1)}h`
      );
    });

    // Skip day if no valid subjects
    if (totalWeight === 0) {
      console.log(`⏭️ No valid subjects for ${dateStr}`);
      continue;
    }

    // Distribute available hours among active subjects based on weights
    plan[dateStr] = [];
    let remainingHours = availableHours;
    const minSessionHours = (preferences?.minSessionLength || 30) / 60;
    const maxSessionHours = (preferences?.maxSessionLength || 120) / 60;

    // Sort subjects by weight (highest first) for fair distribution
    const sortedSubjects = activeSubjects
      .filter((sub) => weights[sub.name] > 0)
      .sort((a, b) => weights[b.name] - weights[a.name]);

    sortedSubjects.forEach((sub, sessionIndex) => {
      const weightProportion = weights[sub.name] / totalWeight;
      let allocatedTime = availableHours * weightProportion;

      // Apply min/max constraints
      allocatedTime = Math.max(
        minSessionHours,
        Math.min(maxSessionHours, allocatedTime)
      );

      // Don't exceed remaining hours needed for this subject
      const hoursRemaining = sub.totalHoursNeeded - allocatedHours[sub.name];
      allocatedTime = Math.min(allocatedTime, hoursRemaining);

      // Don't exceed remaining hours for the day
      allocatedTime = Math.min(allocatedTime, remainingHours);

      // Only add if meets minimum session length
      if (allocatedTime >= minSessionHours) {
        // Convert to hours and minutes, rounded to nearest 5 minutes
        const time = roundToNearestFiveMinutes(allocatedTime);
        const timeFormatted = formatTime(time);
        const decimalHours = time.hours + time.minutes / 60;

        // Get preferred start hour based on user preferences
        const preferredStartHour = getPreferredStartHour(
          preferences,
          sessionIndex
        );

        plan[dateStr].push({
          subject: sub.name,
          hours: decimalHours,
          time: time,
          timeFormatted: timeFormatted,
          difficulty: sub.difficulty,
          daysUntilExam: sub.examDate.diff(currentDate, "day"),
          examDate: sub.examDate.format("DD-MMMM-YYYY"),
          preferredStartHour: preferredStartHour, // NEW: Store preferred start time
        });

        // Track allocated hours
        allocatedHours[sub.name] += decimalHours;
        remainingHours -= decimalHours;

        console.log(
          `    ✓ Allocated ${timeFormatted} to ${
            sub.name
          } at ${preferredStartHour}:00 (total: ${allocatedHours[
            sub.name
          ].toFixed(1)}h)`
        );
      }
    });

    // Remove empty days
    if (plan[dateStr].length === 0) {
      delete plan[dateStr];
    }
  }

  // Summary logging
  console.log("📊 Final allocation summary:");
  subjectList.forEach((sub) => {
    const percentage = (
      (allocatedHours[sub.name] / sub.totalHoursNeeded) *
      100
    ).toFixed(1);
    console.log(
      `  ${sub.name}: ${allocatedHours[sub.name].toFixed(1)}h / ${
        sub.totalHoursNeeded
      }h (${percentage}%)`
    );
  });

  console.log("✅ Plan generated:", plan);
  return plan;
}

/**
 * Calculate free time blocks for display/debugging
 */
export function calculateFreeTimeBlocks(schedule, commitments, preferences) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const freeBlocks = {};

  days.forEach((day) => {
    const availableHours = calculateDailyAvailableHours(
      schedule,
      commitments,
      preferences,
      day
    );
    freeBlocks[day] = availableHours;
  });

  return freeBlocks;
}

export default {
  generateAdvancedStaticPlan,
  calculateFreeTimeBlocks,
};
