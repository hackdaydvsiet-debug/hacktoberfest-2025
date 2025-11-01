import dayjs from "dayjs";

/**
 * Converts decimal hours to hours and minutes, rounded to nearest 5 minutes
 * @param {number} decimalHours - Hours in decimal format (e.g., 2.48)
 * @returns {object} - Object with hours and minutes properties
 */
function roundToNearestFiveMinutes(decimalHours) {
  const totalMinutes = Math.round(decimalHours * 60);
  // Round to nearest 5 minutes
  const roundedMinutes = Math.round(totalMinutes / 5) * 5;

  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;

  return { hours, minutes };
}

/**
 * Formats time object to readable string
 * @param {object} time - Object with hours and minutes
 * @returns {string} - Formatted time string (e.g., "2 hr 30 min")
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

function generateStudyPlan(subjects, availableHoursPerDay) {
  const today = dayjs().startOf("day");
  let plan = {};

  // Prepare subjects and normalize exam dates
  let subjectList = subjects.map((sub) => ({
    ...sub,
    examDate: dayjs(sub.examDate).startOf("day"),
  }));

  // Find the last exam date
  const lastExamDate = subjectList.reduce(
    (latest, sub) => (sub.examDate.isAfter(latest) ? sub.examDate : latest),
    today
  );
  const totalDays = lastExamDate.diff(today, "day");

  // For each day until the day before the last exam, recalculate weights and distribute hours
  for (let d = 0; d < totalDays; d++) {
    const currentDate = today.add(d, "day");
    const dateStr = currentDate.format("DD-MMMM-YYYY");

    // Get subjects whose exams are still upcoming (not on exam day)
    const activeSubjects = subjectList.filter(
      (sub) => sub.examDate.diff(currentDate, "day") > 0
    );

    // Calculate weights for active subjects
    let weights = {};
    let totalWeight = 0;
    activeSubjects.forEach((sub) => {
      const daysLeft = sub.examDate.diff(currentDate, "day");
      weights[sub.name] = 1 / daysLeft;
      totalWeight += 1 / daysLeft;
    });

    // Distribute available hours for this day among active subjects
    plan[dateStr] = [];
    activeSubjects.forEach((sub) => {
      const daysLeft = sub.examDate.diff(currentDate, "day");
      const weightProportion = weights[sub.name] / totalWeight;
      const decimalHours = availableHoursPerDay * weightProportion;

      // Convert to hours and minutes, rounded to nearest 5 minutes
      const time = roundToNearestFiveMinutes(decimalHours);
      const timeFormatted = formatTime(time);

      plan[dateStr].push({
        subject: sub.name,
        hours: decimalHours, // Keep original for backward compatibility
        time: time, // New property: { hours, minutes }
        timeFormatted: timeFormatted, // New property: "2 hr 30 min"
      });
    });
  }

  return plan;
}

export default generateStudyPlan;
