import React, { useState } from "react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Block types with colors
const BLOCK_TYPES = {
  free: {
    label: "Free Time",
    color: "bg-green-100 hover:bg-green-200",
    border: "border-green-300",
  },
  class: {
    label: "Class",
    color: "bg-blue-200 hover:bg-blue-300",
    border: "border-blue-400",
  },
  commitment: {
    label: "Commitment",
    color: "bg-purple-200 hover:bg-purple-300",
    border: "border-purple-400",
  },
  sleep: {
    label: "Sleep",
    color: "bg-gray-200 hover:bg-gray-300",
    border: "border-gray-400",
  },
};

/**
 * WeeklyScheduleGrid - Visual time picker for marking busy/free time blocks
 * Allows drag-to-select across the week's schedule
 */
function WeeklyScheduleGrid({ schedule, onScheduleChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCell, setDragStartCell] = useState(null);
  const [activeBlockType, setActiveBlockType] = useState("class");

  // Initialize empty schedule if none provided
  const currentSchedule = schedule || {};

  /**
   * Toggle a time block's state
   */
  const toggleBlock = (day, hour) => {
    const key = `${day}-${hour}`;
    const newSchedule = { ...currentSchedule };

    if (newSchedule[key]) {
      delete newSchedule[key];
    } else {
      newSchedule[key] = {
        day,
        hour,
        type: activeBlockType,
        label: "",
      };
    }

    onScheduleChange(newSchedule);
  };

  /**
   * Handle drag start
   */
  const handleMouseDown = (day, hour) => {
    setIsDragging(true);
    setDragStartCell({ day, hour });
    toggleBlock(day, hour);
  };

  /**
   * Handle drag over cells
   */
  const handleMouseEnter = (day, hour) => {
    if (isDragging) {
      toggleBlock(day, hour);
    }
  };

  /**
   * Handle drag end
   */
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStartCell(null);
  };

  /**
   * Format hour for display
   */
  const formatHour = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  /**
   * Get block style based on type
   */
  const getBlockStyle = (day, hour) => {
    const key = `${day}-${hour}`;
    const block = currentSchedule[key];

    if (block) {
      const typeStyle = BLOCK_TYPES[block.type] || BLOCK_TYPES.class;
      return `${typeStyle.color} ${typeStyle.border} border`;
    }

    return "bg-white hover:bg-gray-50 border border-gray-200";
  };

  return (
    <div
      className="w-full"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}>
      {/* Block Type Selector Buttons */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-3 font-medium">
          Select block type to mark on the grid:
        </p>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(BLOCK_TYPES).map(([type, style]) => (
            <button
              key={type}
              onClick={() => setActiveBlockType(type)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-md ${
                activeBlockType === type
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white ring-2 ring-purple-300"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300"
              }`}>
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 justify-center p-3 bg-gray-50 rounded-lg">
        {Object.entries(BLOCK_TYPES).map(([type, style]) => (
          <div key={type} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 ${style.color.split(" ")[0]} ${
                style.border
              } border rounded`}></div>
            <span className="text-sm text-gray-700">{style.label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white z-10 border border-gray-300 p-2 text-xs font-semibold text-gray-600 min-w-[60px]">
                  Time
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="border border-gray-300 p-2 text-xs font-semibold text-gray-700 min-w-[80px] bg-gradient-to-r from-blue-50 to-purple-50">
                    {day.substring(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour}>
                  <td className="sticky left-0 bg-white z-10 border border-gray-300 p-1 text-xs text-gray-600 font-medium text-center">
                    {formatHour(hour)}
                  </td>
                  {DAYS.map((day) => {
                    const key = `${day}-${hour}`;
                    const block = currentSchedule[key];

                    return (
                      <td
                        key={key}
                        className={`border border-gray-300 p-0 cursor-pointer select-none transition-colors duration-150 ${getBlockStyle(
                          day,
                          hour
                        )}`}
                        onMouseDown={() => handleMouseDown(day, hour)}
                        onMouseEnter={() => handleMouseEnter(day, hour)}
                        style={{ height: "40px", width: "80px" }}>
                        {block && block.label && (
                          <div className="text-xs text-center px-1 truncate">
                            {block.label}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>💡 Click and drag to mark time blocks • Click again to remove</p>
      </div>
    </div>
  );
}

export default WeeklyScheduleGrid;
