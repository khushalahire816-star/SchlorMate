import { useState } from "react";
import {
  Target,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  FileCheck,
  UserCheck,
  Clock,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import DonutChart from "../../components/charts/DonutChart";

function Prediction() {
  const loading = false;

  const [selectedScholarship, setSelectedScholarship] = useState(
    "AICTE Pragati Scholarship"
  );

  const predictions = {
    "AICTE Pragati Scholarship": {
      chance: 85,
      level: "High Selection Chance",
      color: "#10b981",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      academic: 90,
      income: 95,
      branch: 100,
      profile: 85,
      documents: 80,
    },
    "National Scholarship": {
      chance: 78,
      level: "Good Selection Chance",
      color: "#2563eb",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      academic: 88,
      income: 85,
      branch: 95,
      profile: 85,
      documents: 75,
    },
    "Maharashtra State Scholarship": {
      chance: 74,
      level: "Moderate-High Chance",
      color: "#6366f1",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      academic: 82,
      income: 90,
      branch: 90,
      profile: 80,
      documents: 70,
    },
  };

  const prediction = predictions[selectedScholarship];

  if (loading) {
    return <Loading message="Analyzing your profile credentials..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" /> AI Probability Modeling
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Success Prediction
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Simulate selection probabilities and analyze factors that directly impact your application success.
        </p>
      </div>

      {/* Scholarship Selector Card */}
      <Card className="p-5 sm:p-6" hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Target Scholarship
            </label>
            <p className="text-xs text-slate-500">
              Choose from currently active scholarship programs to evaluate your chances
            </p>
          </div>

          <div className="relative min-w-[280px]">
            <select
              value={selectedScholarship}
              onChange={(e) => setSelectedScholarship(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer pr-10 shadow-xs"
            >
              {Object.keys(predictions).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </Card>

      {/* Prediction Overview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Gauge Card */}
        <Card className="p-6 flex flex-col items-center justify-center text-center" hover>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Predicted Probability
          </span>

          <div className="py-2">
            <DonutChart
              value={prediction.chance}
              maxValue={100}
              centerValue={`${prediction.chance}%`}
              centerLabel="Award Chance"
              size={190}
              strokeWidth={16}
              primaryColor={prediction.color}
            />
          </div>

          <div className="mt-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${prediction.badgeColor}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {prediction.level}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-3 max-w-xs leading-relaxed">
            Your profile meets the high percentile cutoff for applicants in this category.
          </p>
        </Card>

        {/* AI Factor Breakdown */}
        <Card className="lg:col-span-2 p-6" hover>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Factor Breakdown & Impact Weights
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Detailed evaluation of the key criteria determining your final selection probability.
          </p>

          <div className="space-y-4">
            {/* Academic */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Academic Performance (CGPA / Marks)
                </span>
                <span className="text-blue-600 font-bold">{prediction.academic}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.academic}%` }}
                ></div>
              </div>
            </div>

            {/* Income */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Income Eligibility Match
                </span>
                <span className="text-emerald-600 font-bold">{prediction.income}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.income}%` }}
                ></div>
              </div>
            </div>

            {/* Branch */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-purple-600" /> Branch & Specialization Fit
                </span>
                <span className="text-purple-600 font-bold">{prediction.branch}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.branch}%` }}
                ></div>
              </div>
            </div>

            {/* Profile Completeness */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" /> Profile Completeness
                </span>
                <span className="text-amber-600 font-bold">{prediction.profile}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.profile}%` }}
                ></div>
              </div>
            </div>

            {/* Documents Readiness */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-pink-600" /> Document Verification Readiness
                </span>
                <span className="text-pink-600 font-bold">{prediction.documents}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.documents}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Improvement Suggestions */}
      <Card className="p-6 bg-gradient-to-r from-blue-50/50 via-slate-50 to-indigo-50/30 border-blue-100" hover={false}>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-5 h-5 text-blue-700" />
          <h2 className="text-base font-bold text-slate-900">
            Actionable Steps to Increase Probability
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-5">
          Proactively addressing these key items can improve your selection chances for {selectedScholarship}:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Maintain Strong Semester CGPA
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Consistently scoring in the top 15% of your class elevates your priority tier during committee reviews.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Verify Official Income Certificate
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ensure your income certificate is issued by a designated revenue officer for the current fiscal year.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
              <UserCheck className="w-4 h-4 text-purple-600" />
              Complete 100% of Profile Details
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fill in your secondary contact information and branch semester details to eliminate review flags.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              Submit Early Before Closing Date
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Earlier submissions receive priority quota verification before portal traffic spikes close to deadlines.
            </p>
          </div>
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-500">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Disclaimer:</strong> This prediction model produces an empirical estimate based on institutional selection patterns and applicant statistics. Official scholarship awards remain at the sole discretion of the scholarship granting authority.
        </p>
      </div>
    </div>
  );
}

export default Prediction;
