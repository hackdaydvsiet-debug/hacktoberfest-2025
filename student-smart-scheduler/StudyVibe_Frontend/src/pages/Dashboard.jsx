import { useState, useEffect } from "react";
import SubjectForm from "../components/Planner/SubjectForm";
import Footer from "../components/Reusable/Footer";
import Timetable from "../components/Planner/Timetable";
import useGeneratePlan from "../hooks/useGeneratePlan";
import Sidebar from "../components/Reusable/Sidebar";
import StudyCalendar from "../components/Planner/StudyCalendar";
import AICustomizer from "../components/Planner/AICustomizer";
import MotivationalQuote from "../components/Reusable/MotivationalQuote";
import AdvancedSchedulerForm from "../components/Planner/AdvancedSchedulerForm";
import ProgressDashboard from "../components/Planner/ProgressDashboard";
import AdvancedSubjectInput from "../components/Planner/AdvancedSubjectInput";

function Dashboard() {
  // Separate states for Quick Plan and Advanced Plan
  const [quickPlan, setQuickPlan] = useState(null);
  const [advancedPlan, setAdvancedPlan] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [availableHours, setAvailableHours] = useState(0);
  const [studyHoursAvailable, setStudyHoursAvailable] = useState(6); // For Advanced Plan
  const [schedulerMode, setSchedulerMode] = useState("quick"); // "quick" or "advanced"
  const { loading, generatePlan } = useGeneratePlan();

  /**
   * Load cached study plans from localStorage on component mount
   */
  useEffect(() => {
    // Load Quick Plan
    const cachedQuickPlan = localStorage.getItem("quickPlanCache");
    const cachedQuickSubjects = localStorage.getItem("quickPlanSubjects");
    const cachedQuickHours = localStorage.getItem("quickPlanHours");

    if (cachedQuickPlan) {
      try {
        setQuickPlan(JSON.parse(cachedQuickPlan));
        if (cachedQuickSubjects) setSubjects(JSON.parse(cachedQuickSubjects));
        if (cachedQuickHours) setAvailableHours(Number(cachedQuickHours));
        console.log("✅ Loaded cached Quick Plan");
      } catch (error) {
        console.error("Error loading Quick Plan:", error);
        localStorage.removeItem("quickPlanCache");
        localStorage.removeItem("quickPlanSubjects");
        localStorage.removeItem("quickPlanHours");
      }
    }

    // Load Advanced Plan
    const cachedAdvancedPlan = localStorage.getItem("advancedPlanCache");
    const cachedAdvancedSubjects = localStorage.getItem("advancedPlanSubjects");
    const cachedStudyHours = localStorage.getItem("studyHoursAvailable");

    if (cachedAdvancedPlan) {
      try {
        setAdvancedPlan(JSON.parse(cachedAdvancedPlan));
        if (cachedAdvancedSubjects)
          setSubjects(JSON.parse(cachedAdvancedSubjects));
        if (cachedStudyHours) setStudyHoursAvailable(Number(cachedStudyHours));
        console.log("✅ Loaded cached Advanced Plan");
      } catch (error) {
        console.error("Error loading Advanced Plan:", error);
        localStorage.removeItem("advancedPlanCache");
        localStorage.removeItem("advancedPlanSubjects");
        localStorage.removeItem("studyHoursAvailable");
      }
    }
  }, []);

  const handleGenerate = async (subjectsData, hours) => {
    setSubjects(subjectsData);
    setAvailableHours(hours);
    const plan = await generatePlan(subjectsData, hours);
    setQuickPlan(plan);

    // Cache the Quick Plan and related data
    if (plan) {
      localStorage.setItem("quickPlanCache", JSON.stringify(plan));
      localStorage.setItem("quickPlanSubjects", JSON.stringify(subjectsData));
      localStorage.setItem("quickPlanHours", hours.toString());
      console.log("💾 Quick Plan cached");
    }
  };

  const handleSmartPlanGenerated = (smartPlan) => {
    setQuickPlan(smartPlan);

    // Cache the AI-generated smart plan
    if (smartPlan) {
      localStorage.setItem("quickPlanCache", JSON.stringify(smartPlan));
      console.log("💾 Smart Quick Plan cached");
    }
  };

  const handleAdvancedGenerate = async (advancedData, useAI = false) => {
    console.log("Advanced scheduler data:", advancedData);

    if (useAI) {
      // TODO: Implement AI-powered scheduling
      alert("🚀 AI optimization is in preview! Coming soon.");
      return;
    }

    // Use static algorithm for manual scheduling
    const { generateAdvancedStaticPlan } = await import(
      "../utils/advancedScheduler"
    );
    const plan = generateAdvancedStaticPlan(
      advancedData.subjects,
      advancedData.schedule,
      advancedData.commitments,
      advancedData.preferences,
      studyHoursAvailable
    );

    setAdvancedPlan(plan);

    // Cache the advanced study plan and related data
    if (plan) {
      localStorage.setItem("advancedPlanCache", JSON.stringify(plan));
      localStorage.setItem(
        "advancedPlanSubjects",
        JSON.stringify(advancedData.subjects)
      );
      localStorage.setItem(
        "studyHoursAvailable",
        studyHoursAvailable.toString()
      );
      console.log("💾 Advanced Plan cached");
    }
  };

  /**
   * Clear cached study plan and reset dashboard
   */
  const handleClearPlan = () => {
    const planType = schedulerMode === "quick" ? "Quick Plan" : "Advanced Plan";

    if (
      confirm(
        `Are you sure you want to clear your current ${planType}? This will also clear your progress tracking and reset all input forms.`
      )
    ) {
      if (schedulerMode === "quick") {
        // Clear Quick Plan
        localStorage.removeItem("quickPlanCache");
        localStorage.removeItem("quickPlanSubjects");
        localStorage.removeItem("quickPlanHours");
        setQuickPlan(null);
        setSubjects([]);
        setAvailableHours(0);
        console.log("🗑️ Quick Plan cache cleared");
      } else {
        // Clear Advanced Plan
        localStorage.removeItem("advancedPlanCache");
        localStorage.removeItem("advancedPlanSubjects");
        localStorage.removeItem("studyHoursAvailable");
        setAdvancedPlan(null);
        setSubjects([]);
        setStudyHoursAvailable(6);
        console.log("🗑️ Advanced Plan cache cleared");
      }

      // Clear progress tracking
      localStorage.removeItem("studyProgress");

      // Reload page to reset all form states
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col place-items-stretch">
      <Sidebar />
      <div className="px-6 sm:px-12 lg:px-20">
        <div className="flex flex-col items-center justify-center mt-12 mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient-xy">
            StudyVibe - Level Up Your Learning Vibe
          </h1>
          <p className="text-sm sm:text-md md:text-lg text-gray-700 text-center max-w-3xl px-4 animate-fade-in">
            Effortlessly organize, plan, and thrive with AI-powered study guides
            tailored just for you.
          </p>

          {/* Motivational Quote - Changes on every refresh */}
          <div className="w-full max-w-4xl mb-10">
            <MotivationalQuote />
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-3 bg-white rounded-xl shadow-lg p-2.5">
            <button
              onClick={() => setSchedulerMode("quick")}
              className={`w-48 h-16 flex items-center justify-center rounded-lg font-semibold text-base transition-all duration-300 ${
                schedulerMode === "quick"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}>
              ⚡ Quick Plan
            </button>
            <button
              onClick={() => setSchedulerMode("advanced")}
              className={`w-48 h-16 flex flex-col items-center justify-center rounded-lg font-semibold text-sm transition-all duration-300 leading-tight ${
                schedulerMode === "advanced"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}>
              <span className="flex items-center gap-1">
                🎯 Advanced Scheduler
              </span>
            </button>
          </div>

          {/* Clear Plan Button - Shows when plan exists */}
          {((schedulerMode === "quick" && quickPlan) ||
            (schedulerMode === "advanced" && advancedPlan)) && (
            <div className="mt-4">
              <button
                onClick={handleClearPlan}
                className="px-4 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-300 flex items-center gap-2">
                🗑️ Clear Study Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conditional Rendering Based on Mode */}
      {schedulerMode === "quick" ? (
        <div className="flex items-stretch justify-stretch flex-col xl:items-start xl:flex-row">
          <div className="mt-8 pl-8 flex-1 flex-col items-center  flex">
            <SubjectForm onGenerate={handleGenerate} />
            <div className="hidden xl:flex">
              <StudyCalendar studyPlan={quickPlan} />
            </div>
          </div>
          <div className="flex flex-1 flex-col px-4">
            {/* AI Customizer at the top */}
            <div className="mt-8">
              <AICustomizer
                subjects={subjects}
                availableHours={availableHours}
                onSmartPlanGenerated={handleSmartPlanGenerated}
              />
            </div>

            {/* Loading and Timetable */}
            {loading && <div className="text-center py-4">Loading...</div>}
            {quickPlan && <Timetable plan={quickPlan} />}
          </div>
          <div className="flex xl:hidden">
            <StudyCalendar studyPlan={quickPlan} />
          </div>
        </div>
      ) : (
        <div className="mt-8 px-4 max-w-6xl mx-auto">
          {/* Step-by-step guide banner */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl">
            <h3 className="text-lg font-bold text-purple-900 mb-2">
              📝 How to Generate Your Study Plan:
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 text-sm text-purple-800">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs">
                  1
                </span>
                <span>Add your subjects below</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs">
                  2
                </span>
                <span>Configure your schedule & preferences</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs">
                  3
                </span>
                <span>Click "Generate Study Plan"</span>
              </div>
            </div>
          </div>

          {/* Subject Input - Step 1 */}
          <div className="mb-6">
            <AdvancedSubjectInput
              subjects={subjects}
              onSubjectsChange={setSubjects}
              studyHoursAvailable={studyHoursAvailable}
              onStudyHoursChange={setStudyHoursAvailable}
            />
          </div>

          {/* Advanced Scheduler Form - Step 2 & 3 */}
          <AdvancedSchedulerForm
            onGenerate={handleAdvancedGenerate}
            subjects={subjects}
          />
          {advancedPlan && (
            <div className="mt-8">
              <StudyCalendar studyPlan={advancedPlan} />
              <Timetable plan={advancedPlan} />
            </div>
          )}
        </div>
      )}

      {/* Progress Dashboard - Shows for both modes when plan exists */}
      {((schedulerMode === "quick" && quickPlan) ||
        (schedulerMode === "advanced" && advancedPlan)) && (
        <div className="px-4">
          <ProgressDashboard
            studyPlan={schedulerMode === "quick" ? quickPlan : advancedPlan}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
export default Dashboard;
