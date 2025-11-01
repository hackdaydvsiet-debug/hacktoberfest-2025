import dayjs from "dayjs";

// Helper function to make time display nice and user-friendly
// Takes something like 2.48 hours and converts to "2 hr 30 min"
// Rounds to nearest 5 min because nobody wants "2 hr 28.8 min"
function roundToNearestFiveMinutes(decimalHours) {
  const totalMinutes = Math.round(decimalHours * 60);
  // Round to nearest 5 minutes for cleaner display
  const roundedMinutes = Math.round(totalMinutes / 5) * 5;

  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;

  return { hours, minutes };
}

// Format time into a nice readable string
// Example: {hours: 2, minutes: 30} becomes "2 hr 30 min"
function formatTime(time) {
  const { hours, minutes } = time;

  // Edge case: no time at all
  if (hours === 0 && minutes === 0) {
    return "0 min";
  }

  let result = "";
  if (hours > 0) {
    result += `${hours} hr`;
  }
  if (minutes > 0) {
    if (result) result += " "; // add space between hours and minutes
    result += `${minutes} min`;
  }

  return result;
}

// Main function to generate the study plan
// Basic idea: subjects with exams coming up sooner get more time each day
function generateStudyPlan(subjects, availableHoursPerDay) {
  const today = dayjs().startOf("day");
  let plan = {};

  // Convert all exam dates to dayjs objects so we can do date math
  let subjectList = subjects.map((sub) => ({
    ...sub,
    examDate: dayjs(sub.examDate).startOf("day"),
  }));

  // Figure out when the last exam is so we know how many days to plan for
  const lastExamDate = subjectList.reduce(
    (latest, sub) => (sub.examDate.isAfter(latest) ? sub.examDate : latest),
    today
  );
  const totalDays = lastExamDate.diff(today, "day");

  // Go through each day and figure out what to study
  // We recalculate priorities each day because urgency changes as exams get closer
  for (let d = 0; d < totalDays; d++) {
    const currentDate = today.add(d, "day");
    const dateStr = currentDate.format("DD-MMMM-YYYY");

    // Only include subjects whose exams haven't happened yet
    // (no point studying for an exam that already happened!)
    const activeSubjects = subjectList.filter(
      (sub) => sub.examDate.diff(currentDate, "day") > 0
    );

    // Calculate how important each subject is today
    // Subjects with exams sooner get higher weights (1/daysLeft)
    // So if an exam is in 2 days, weight = 1/2 = 0.5
    // If an exam is in 10 days, weight = 1/10 = 0.1 (less urgent)
    let weights = {};
    let totalWeight = 0;
    activeSubjects.forEach((sub) => {
      const daysLeft = sub.examDate.diff(currentDate, "day");
      weights[sub.name] = 1 / daysLeft;
      totalWeight += 1 / daysLeft;
    });

    // Now split up the available study time based on those weights
    plan[dateStr] = [];
    activeSubjects.forEach((sub) => {
      const daysLeft = sub.examDate.diff(currentDate, "day");
      const weightProportion = weights[sub.name] / totalWeight;
      const decimalHours = availableHoursPerDay * weightProportion;

      // Convert decimal hours to something readable
      const time = roundToNearestFiveMinutes(decimalHours);
      const timeFormatted = formatTime(time);

      plan[dateStr].push({
        subject: sub.name,
        hours: decimalHours, // keep the raw number for any calculations
        time: time, // nice object format: { hours: 2, minutes: 30 }
        timeFormatted: timeFormatted, // human-readable: "2 hr 30 min"
      });
    });
  }

  return plan;
}

export default generateStudyPlan;
