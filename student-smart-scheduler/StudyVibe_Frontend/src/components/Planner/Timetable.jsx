import React from "react";

function StudyPlanTable({ plan }) {
  if (!plan || Object.keys(plan).length === 0) {
    return (
      <div className="text-center text-gray-400 mt-8">
        No study plan available.
      </div>
    );
  }

  return (
    <div className="min-w-[300px] w-max mx-auto mt-8 bg-white mb-2 rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all duration-500 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Study Plan
      </h2>
      <div className="overflow-hidden rounded-xl">
        <table className="w-[300px] border-separate rounded-xl overflow-hidden font-sans text-base bg-[#fafbfc] sm:w-[400px] md:w-[600px] lg:w-[700px] xl:w-[500px] 2xl:w-[600px]">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <th className="py-3 px-2 text-left font-semibold tracking-wide">
                Date
              </th>
              <th className="py-3 px-2 text-left font-semibold tracking-wide">
                Subject
              </th>
              <th className="py-3 px-2 text-left font-semibold tracking-wide">
                Hours
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(plan).map(([date, subjects], dateIdx) => (
              <React.Fragment key={date}>
                {/* Only add a line before every date except the first */}
                {dateIdx != 0 && (
                  <tr>
                    <td colSpan={3}>
                      <div className="border-t border-blue-300 my-2"></div>
                    </td>
                  </tr>
                )}
                {subjects.map((entry, idx) => (
                  <tr
                    key={date + idx}
                    className={`${
                      idx % 2 === 0 ? "bg-[#f3f6fa]" : "bg-white"
                    } border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200`}>
                    <td
                      className={`py-0 px-0 ${
                        idx === 0
                          ? "font-medium text-slate-800 rounded-tl-lg"
                          : "font-normal"
                      } w-1/4 sm:py-1 sm:px-1 md:py-3 md:px-2`}>
                      {idx === 0 ? date : ""}
                    </td>
                    <td className="py-1 w-fit px-2 text-slate-700 sm:w-1/2 sm:py-3">
                      {entry.subject}
                    </td>
                    <td className="py-1 px-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-medium w-1/4">
                      {entry.timeFormatted || entry.hours}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudyPlanTable;
