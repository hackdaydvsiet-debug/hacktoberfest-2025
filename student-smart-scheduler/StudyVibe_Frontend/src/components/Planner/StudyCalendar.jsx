import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { useState } from "react";

// Define a vibrant color palette for subjects with better contrast
const subjectColors = [
  { bg: "#8B5CF6", text: "#FFFFFF" }, // purple
  { bg: "#EC4899", text: "#FFFFFF" }, // pink
  { bg: "#F59E0B", text: "#FFFFFF" }, // amber
  { bg: "#3B82F6", text: "#FFFFFF" }, // blue
  { bg: "#10B981", text: "#FFFFFF" }, // green
  { bg: "#EF4444", text: "#FFFFFF" }, // red
  { bg: "#6366F1", text: "#FFFFFF" }, // indigo
  { bg: "#14B8A6", text: "#FFFFFF" }, // teal
];

// Map subjects to colors
const getSubjectColor = (() => {
  const subjectMap = {};
  let colorIdx = 0;
  return (subject) => {
    if (!subjectMap[subject]) {
      subjectMap[subject] = subjectColors[colorIdx % subjectColors.length];
      colorIdx++;
    }
    return subjectMap[subject];
  };
})();

const convertPlanToEvents = (plan) => {
  const events = [];

  Object.entries(plan).forEach(([date, entries]) => {
    // Check if this is an Advanced Plan (has preferredStartHour) or Quick Plan
    const isAdvancedPlan = entries.some(
      (entry) => entry.preferredStartHour !== undefined
    );

    let currentTime = dayjs(date, "DD-MMMM-YYYY").hour(8).minute(0).second(0); // Default start at 8:00 AM for Quick Plan

    entries.forEach((entry, index) => {
      let start;

      if (isAdvancedPlan && entry.preferredStartHour !== undefined) {
        // Advanced Plan: Sequential non-overlapping sessions
        if (index === 0) {
          // First session: use preferred start hour
          start = dayjs(date, "DD-MMMM-YYYY")
            .hour(entry.preferredStartHour)
            .minute(0)
            .second(0);
        } else {
          // Subsequent sessions: start after previous session ends
          start = currentTime;
        }
      } else {
        // Quick Plan: Stack sessions sequentially starting from 8 AM
        start = currentTime;
      }

      // Use the rounded time values if available, otherwise fallback to hours
      const hours = entry.time?.hours || Math.floor(entry.hours);
      const minutes = entry.time?.minutes || Math.round((entry.hours % 1) * 60);
      const end = start.add(hours, "hour").add(minutes, "minute");

      const colors = getSubjectColor(entry.subject);
      const timeFormatted = entry.timeFormatted || `${hours} hr ${minutes} min`;

      events.push({
        id: `${date}-${entry.subject}-${index}`,
        title: entry.subject,
        start: start.format("YYYY-MM-DDTHH:mm:ss"),
        end: end.format("YYYY-MM-DDTHH:mm:ss"),
        backgroundColor: colors.bg,
        borderColor: colors.bg,
        textColor: colors.text,
        extendedProps: {
          subject: entry.subject,
          duration: timeFormatted,
          startTime: start.format("h:mm A"),
          endTime: end.format("h:mm A"),
          examDate: entry.examDate || "Not specified",
          difficulty: entry.difficulty || "Medium",
          date: date,
        },
      });

      // Update currentTime for next session (sequential stacking with 15 min break)
      currentTime = end.add(15, "minute");
    });
  });

  return events;
};

// Get unique subjects from plan for legend
const getUniqueSubjects = (plan) => {
  const subjects = new Set();
  Object.values(plan).forEach((entries) => {
    entries.forEach((entry) => subjects.add(entry.subject));
  });
  return Array.from(subjects);
};

export default function StudyCalendar({ studyPlan }) {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  if (!studyPlan) {
    return (
      <div className="max-w-md mt-8 mb-12 mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-2xl 2xl:max-w-3xl bg-gradient-to-br from-blue-100 via-white to-pink-100 rounded-2xl p-6 shadow-xl">
        <p className="py-10 text-center block w-full text-gray-600">
          No study plan available. Generate one to get started!
        </p>
      </div>
    );
  }

  const events = convertPlanToEvents(studyPlan);
  const uniqueSubjects = getUniqueSubjects(studyPlan);

  // Handle event mouse enter
  const handleEventMouseEnter = (info) => {
    const rect = info.el.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setHoveredEvent(info.event);
  };

  // Handle event mouse leave
  const handleEventMouseLeave = () => {
    setHoveredEvent(null);
  };

  return (
    <div className="max-w-md mt-8 mb-12 mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-2xl 2xl:max-w-3xl bg-gradient-to-br from-purple-100 via-white to-blue-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in relative">
      {/* Calendar Title */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          📅 Study Calendar
        </h2>
        <div className="text-sm text-gray-600 italic">
          💡 Hover over events for details
        </div>
      </div>

      {/* Subject Legend */}
      <div className="mb-4 p-3 bg-white/60 rounded-lg border border-purple-200">
        <div className="text-xs font-semibold text-gray-700 mb-2">
          📚 Subject Legend:
        </div>
        <div className="flex flex-wrap gap-2">
          {uniqueSubjects.map((subject) => {
            const colors = getSubjectColor(subject);
            return (
              <div
                key={subject}
                className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border shadow-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.bg }}></div>
                <span className="text-xs font-medium text-gray-700">
                  {subject}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Display */}
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          initialDate={new Date().toISOString().split("T")[0]}
          events={events}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          eventDisplay="block"
          slotMinTime="06:00:00"
          slotMaxTime="24:00:00"
          allDaySlot={false}
          dayHeaderFormat={{ weekday: "short", day: "numeric", month: "short" }}
          eventMouseEnter={handleEventMouseEnter}
          eventMouseLeave={handleEventMouseLeave}
          eventContent={(eventInfo) => {
            return (
              <div className="p-1 h-full flex flex-col justify-center items-center text-center overflow-hidden">
                <div className="font-semibold text-xs leading-tight">
                  {eventInfo.event.title}
                </div>
                <div className="text-xs opacity-90 mt-0.5">
                  {eventInfo.event.extendedProps.duration}
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Hover Tooltip */}
      {hoveredEvent && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: "translate(-50%, -100%)",
          }}>
          <div className="bg-white rounded-lg shadow-2xl border-2 border-purple-300 p-4 min-w-[280px] animate-fade-in">
            {/* Subject Header */}
            <div
              className="flex items-center gap-2 mb-3 pb-2 border-b-2"
              style={{ borderColor: hoveredEvent.backgroundColor }}>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: hoveredEvent.backgroundColor }}></div>
              <h3 className="font-bold text-lg text-gray-800">
                {hoveredEvent.extendedProps.subject}
              </h3>
            </div>

            {/* Event Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium w-20">📅 Date:</span>
                <span className="text-gray-800">
                  {hoveredEvent.extendedProps.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium w-20">⏰ Time:</span>
                <span className="text-gray-800">
                  {hoveredEvent.extendedProps.startTime} -{" "}
                  {hoveredEvent.extendedProps.endTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium w-20">
                  ⏱️ Duration:
                </span>
                <span className="text-gray-800 font-semibold">
                  {hoveredEvent.extendedProps.duration}
                </span>
              </div>

              {hoveredEvent.extendedProps.examDate !== "Not specified" && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium w-20">
                    🎯 Exam:
                  </span>
                  <span className="text-gray-800">
                    {hoveredEvent.extendedProps.examDate}
                  </span>
                </div>
              )}

              {hoveredEvent.extendedProps.difficulty && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium w-20">
                    📊 Level:
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      hoveredEvent.extendedProps.difficulty === "Hard"
                        ? "bg-red-100 text-red-700"
                        : hoveredEvent.extendedProps.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                    {hoveredEvent.extendedProps.difficulty}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Calendar Styles */}
      <style jsx global>{`
        .fc-event {
          cursor: pointer;
          border-radius: 6px !important;
          border-width: 2px !important;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .fc-event:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          z-index: 10 !important;
        }

        .fc-daygrid-event {
          padding: 4px 6px;
        }

        .fc-timegrid-event {
          border-radius: 8px !important;
        }

        .fc-col-header-cell {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white !important;
          font-weight: 600;
          padding: 12px 4px;
        }

        .fc-timegrid-slot {
          height: 3em;
        }

        .fc-button {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 100%
          ) !important;
          border: none !important;
          text-transform: capitalize !important;
          font-weight: 600 !important;
        }

        .fc-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
        }

        .fc-button-active {
          background: linear-gradient(
            135deg,
            #764ba2 0%,
            #667eea 100%
          ) !important;
        }

        .fc-toolbar-title {
          font-weight: 700 !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          font-size: 1.5rem !important;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translate(-50%, -100%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -100%) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
