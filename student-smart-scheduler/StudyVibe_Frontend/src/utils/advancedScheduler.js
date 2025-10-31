import dayjs from "dayjs";

// Same helper functions as the basic planner
// These make time display look nice for users
function roundToNearestFiveMinutes(decimalHours) {
  const totalMinutes = Math.round(decimalHours * 60);
  const roundedMinutes = Math.round(totalMinutes / 5) * 5;

  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;

  return { hours, minutes };
}

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

// Figure out what time of day the user prefers to study
// Some people are morning people, some are night owls
// This tries to schedule sessions during their preferred times
function getPreferredStartHour(preferences, sessionIndex = 0) {
  if (!preferences?.preferredTimes || preferences.preferredTimes.length === 0) {
    // If they didn't specify, default to 8 AM (reasonable start time)
    return 8;
  }

  // Map the friendly names to actual hours
  const timeSlots = {
    "Early Morning (5-8 AM)": [5, 6, 7],
    "Morning (8-12 PM)": [8, 9, 10, 11],
    "Afternoon (12-5 PM)": [12, 13, 14, 15, 16],
    "Evening (5-9 PM)": [17, 18, 19, 20],
    "Night (9 PM+)": [21, 22, 23],
  };

  // Build a list of all the hours they prefer
  let preferredHours = [];
  preferences.preferredTimes.forEach((timeStr) => {
    if (timeSlots[timeStr]) {
      preferredHours = preferredHours.concat(timeSlots[timeStr]);
    }
  });

  if (preferredHours.length === 0) {
    return 8; // fallback if something went wrong
  }

  // Put them in order so sessions go chronologically
  preferredHours.sort((a, b) => a - b);

  // If they have multiple sessions in a day, spread them out
  // e.g. session 0 at 9am, session 1 at 2pm, session 2 at 7pm
  return preferredHours[sessionIndex % preferredHours.length];
}

// This is where we get realistic about how much time someone actually has
// We start with 24 hours and subtract sleep, classes, work, etc.
function calculateDailyAvailableHours(
  schedule,
  commitments,
  preferences,
  dayOfWeek
) {
  const dayName = dayOfWeek;
  const dayShort = dayOfWeek.substring(0, 3);

  // Everyone starts with 24 hours in a day
  let availableHours = 24;

  // First, subtract sleep time (can't study while sleeping!)
  if (preferences?.sleepSchedule) {
    const { start, end } = preferences.sleepSchedule;
    if (start > end) {
      // Handle cases like 11 PM to 7 AM (crosses midnight)
      availableHours -= 24 - start + end;
    } else {
      availableHours -= end - start;
    }
  }

  // Subtract any manual schedule blocks (classes, meetings, etc)
  // The schedule is stored as "Monday-8" => {type: "class"} format
  if (schedule && typeof schedule === "object") {
    Object.entries(schedule).forEach(([key, block]) => {
      const [blockDay, blockHour] = key.split("-");
      if (blockDay === dayName && block && block.type) {
        // If it's not free time, it's busy time
        if (block.type !== "free") {
          availableHours -= 1; // each block is 1 hour
        }
      }
    });
  }

  // Also subtract any recurring commitments (like a part-time job)
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

  // Don't let it go negative (edge case protection)
  availableHours = Math.max(0, availableHours);

  // If they use Pomodoro technique, account for break time
  // Can't study for 4 hours straight - gotta take breaks!
  if (preferences?.pomodoro && availableHours > 0) {
    const pomodoro = preferences.pomodoro;
    const focusMin = pomodoro.focusDuration || 25;
    const breakMin = pomodoro.breakDuration || 5;

    // Basically, for every 25 min of focus, you take a 5 min break
    // So effective study time is reduced
    const breakOverhead = breakMin / focusMin;
    availableHours *= 1 - breakOverhead;
  }

  return Math.max(0, availableHours);
}

// This is the main advanced scheduler
// It's "advanced" because it considers way more factors than the basic one:
// - Your actual schedule (classes, work, commitments)
// - Subject difficulty (harder subjects get more time)
// - Preferred study times (morning vs night person)
// - Pomodoro breaks
// - Min/max session lengths
export function generateAdvancedStaticPlan(
  subjects,
  schedule,
  commitments,
  preferences,
  studyHoursAvailable = 6
) {
  // Debug logging - helpful when things don't work as expected
  console.log("🔍 Advanced Scheduler Input:", {
    subjects,
    schedule,
    commitments,
    preferences,
    studyHoursAvailable,
  });

  const today = dayjs().startOf("day");
  let plan = {};

  // Quick sanity check
  if (!subjects || subjects.length === 0) {
    console.warn("⚠️ No subjects provided");
    return plan;
  }

  // Clean up the subject data and get difficulty ratings
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

  // Put them in order - earliest exams first
  subjectList.sort((a, b) => a.examDate.diff(b.examDate));

  // Figure out how many days we're planning for
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

  // Helper array for converting day numbers to names
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Keep track of how much time we've given each subject
  // so we can balance things out as we go
  const allocatedHours = {};
  subjectList.forEach((sub) => {
    allocatedHours[sub.name] = 0;
  });

  // Now let's build the actual day-by-day plan
  for (let d = 0; d < totalDays; d++) {
    const currentDate = today.add(d, "day");
    const dateStr = currentDate.format("DD-MMMM-YYYY");
    const dayOfWeek = dayNames[currentDate.day()];

    // How much free time do they have today?
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

    // If they're super busy today, just skip it
    if (availableHours <= 0.5) {
      console.log(`⏭️ Skipping ${dateStr} - insufficient time`);
      continue;
    }

    // Only study for exams that haven't happened yet
    const activeSubjects = subjectList.filter(
      (sub) => sub.examDate.diff(currentDate, "day") > 0
    );

    if (activeSubjects.length === 0) {
      console.log(`✅ No more subjects to study for ${dateStr}`);
      continue;
    }

    // Here's where it gets interesting - calculate priority weights
    // This considers urgency, difficulty, and how behind we are
    let weights = {};
    let totalWeight = 0;

    activeSubjects.forEach((sub) => {
      const daysLeft = Math.max(1, sub.examDate.diff(currentDate, "day"));
      const hoursRemaining = Math.max(
        0,
        sub.totalHoursNeeded - allocatedHours[sub.name]
      );

      // If we've already allocated enough time to this subject, skip it
      if (hoursRemaining < 0.25) {
        return;
      }

      // Now for the fun part - weighing different factors

      // 1. Urgency: Exams that are soon get higher priority
      // Using square root so it doesn't get TOO crazy as exams approach
      const urgencyWeight = 1 / Math.sqrt(daysLeft);

      // 2. Difficulty: Harder subjects need more time
      // Scale difficulty (1-5) relative to average difficulty (3)
      const difficultyMultiplier = sub.difficulty / 3;

      // 3. Catch-up factor: If we're behind on a subject, prioritize it
      // If we've only done 30% of needed hours, this boosts the weight
      const progressRatio = allocatedHours[sub.name] / sub.totalHoursNeeded;
      const progressDeficit = Math.max(0.5, 1 - progressRatio);

      // 4. Total time needed: Subjects that need more hours overall get attention
      const hoursWeight = Math.sqrt(hoursRemaining);

      // Multiply all these factors together to get final weight
      let weight =
        urgencyWeight * difficultyMultiplier * progressDeficit * hoursWeight;

      weights[sub.name] = weight;
      totalWeight += weight;

      // Debug output so we can see what's happening
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
