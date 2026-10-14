import { useEffect, useState } from "react";
import {
  Target,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  FileCheck,
  UserCheck,
  Clock,
  ChevronDown,
  TrendingUp,
  IndianRupee,
  GraduationCap,
} from "lucide-react";

import Card from "../../components/common/Card";
import DonutChart from "../../components/charts/DonutChart";
import { useAuth } from "../../context/AuthContext";

import { getAllScholarships } from "../../services/scholarshipData";

import {
  getStudentProfile,
  getProfileCompletion,
} from "../../services/studentProfileService";

// Sample prediction values for the current prototype.
// These will be replaced by the trained prediction model later.
const DEMO_PREDICTIONS = {
  "aicte-pragati-demo": {
    chance: 85,
    level: "High Selection Chance",
    color: "#10b981",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    academic: 90,
    income: 95,
    branch: 100,
    documents: 80,
  },

  "national-scholarship-demo": {
    chance: 78,
    level: "Good Selection Chance",
    color: "#2563eb",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    academic: 88,
    income: 85,
    branch: 95,
    documents: 75,
  },

  "maharashtra-state-scholarship-demo": {
    chance: 74,
    level: "Moderate-High Chance",
    color: "#6366f1",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    academic: 82,
    income: 90,
    branch: 90,
    documents: 70,
  },
};

function Prediction() {
  const { user } = useAuth();

  const scholarships = getAllScholarships();

  const [selectedScholarship, setSelectedScholarship] = useState(
    scholarships[0]?.id || "",
  );

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(getStudentProfile(user?.email || undefined));
  }, [user?.email]);

  const selectedRecord = scholarships.find(
    (scholarship) => scholarship.id === selectedScholarship,
  );

  const demoPrediction = DEMO_PREDICTIONS[selectedScholarship] || {
    chance: 75,
    level: "Good Selection Chance",
    color: "#2563eb",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    academic: 80,
    income: 80,
    branch: 85,
    documents: 75,
  };

  const profileCompletion = profile ? getProfileCompletion(profile) : 0;

  const prediction = {
    ...demoPrediction,
    profile: profileCompletion,
  };

  const factorItems = [
    {
      label: "Academic Performance (CGPA / Marks)",
      value: prediction.academic,
      icon: BookOpen,
      color: "bg-blue-600",
      textColor: "text-blue-600",
    },
    {
      label: "Income Eligibility Match",
      value: prediction.income,
      icon: CheckCircle2,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
    },
    {
      label: "Branch & Specialization Fit",
      value: prediction.branch,
      icon: Target,
      color: "bg-purple-600",
      textColor: "text-purple-600",
    },
    {
      label: "Profile Completeness",
      value: prediction.profile,
      icon: UserCheck,
      color: "bg-amber-500",
      textColor: "text-amber-600",
    },
    {
      label: "Document Verification Readiness",
      value: prediction.documents,
      icon: FileCheck,
      color: "bg-pink-500",
      textColor: "text-pink-600",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            AI Probability Modeling
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Success Prediction
        </h1>

        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Explore estimated selection chances and review the factors associated
          with your scholarship application.
        </p>
      </div>

      {/* Scholarship Selector */}
      <Card className="p-5 sm:p-6" hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label
              htmlFor="targetScholarship"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Select Target Scholarship
            </label>

            <p className="text-xs text-slate-500">
              Choose a scholarship to view its prediction dashboard.
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <select
              id="targetScholarship"
              value={selectedScholarship}
              onChange={(event) => setSelectedScholarship(event.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer pr-10 shadow-xs"
            >
              {scholarships.map((scholarship) => (
                <option key={scholarship.id} value={scholarship.id}>
                  {scholarship.name}
                </option>
              ))}
            </select>

            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </Card>

      {/* Prediction Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Prediction Gauge */}
        <Card
          className="p-6 flex flex-col items-center justify-center text-center"
          hover
        >
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
            Estimated outcome for{" "}
            {selectedRecord?.name || "the selected scholarship"}.
          </p>
        </Card>

        {/* Factor Breakdown */}
        <Card className="lg:col-span-2 p-6" hover>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-blue-600" />

            <h2 className="text-base font-bold text-slate-900">
              Factor Breakdown & Impact Weights
            </h2>
          </div>

          <p className="text-xs text-slate-500 mb-6">
            Review the individual factors displayed for this scholarship.
          </p>

          <div className="space-y-5">
            {factorItems.map((factor) => {
              const Icon = factor.icon;

              return (
                <div key={factor.label}>
                  <div className="flex justify-between items-start gap-3 text-xs font-semibold mb-1.5">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${factor.textColor}`}
                      />

                      {factor.label}
                    </span>

                    <span className={`font-bold ${factor.textColor}`}>
                      {factor.value}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${factor.color} h-2 rounded-full transition-all duration-500`}
                      style={{
                        width: `${Math.max(0, Math.min(100, factor.value))}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5" hover>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Selection Estimate
            </p>

            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>

          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {prediction.chance}%
          </p>

          <p className="text-xs text-slate-500 mt-1">Displayed estimate</p>
        </Card>

        <Card className="p-5" hover>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Profile Completion
            </p>

            <UserCheck className="w-5 h-5 text-blue-600" />
          </div>

          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {profileCompletion}%
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Based on your saved profile
          </p>
        </Card>

        <Card className="p-5" hover>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Listed Scholarship Benefit
            </p>

            <IndianRupee className="w-5 h-5 text-purple-600" />
          </div>

          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {selectedRecord?.benefitAmount != null
              ? new Intl.NumberFormat("en-IN", {
                  maximumFractionDigits: 0,
                }).format(selectedRecord.benefitAmount)
              : "—"}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            INR · {selectedRecord?.benefitPeriod || "Period not specified"}
          </p>
        </Card>
      </div>

      {/* Improvement Suggestions */}
      <Card
        className="p-6 bg-gradient-to-r from-blue-50/50 via-slate-50 to-indigo-50/30 border-blue-100"
        hover={false}
      >
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-5 h-5 text-blue-700" />

          <h2 className="text-base font-bold text-slate-900">
            Actionable Steps to Improve Your Profile
          </h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-5">
          Review these preparation steps for{" "}
          {selectedRecord?.name || "your selected scholarship"}.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Maintain Strong Academic Performance
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Work consistently on your semester subjects and keep your latest
              academic marksheets updated.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Prepare Required Documents
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Keep your identity proof, income certificate, admission proof, and
              applicable certificates organised.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
              <UserCheck className="w-4 h-4 text-purple-600" />
              Complete Your Student Profile
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Fill in the missing academic, personal, and financial details in
              your ScholarMate profile.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              Track Application Deadlines
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Check application dates regularly and prepare your documents early
              so you have time to review everything.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs sm:col-span-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Review Your Scholarship Requirements
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Compare your course, academic results, domicile, and financial
              details with the scholarship's requirements.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Prediction;
