import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  Printer,
  User,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  Award,
  AlertCircle,
  ArrowRight,
  ClipboardList,
  Calendar,
  IndianRupee,
  GraduationCap,
  Clock,
  Bookmark,
} from "lucide-react";

import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import DonutChart from "../../components/charts/DonutChart";

import { useAuth } from "../../context/AuthContext";

import {
  getStudentProfile,
  getProfileCompletion,
} from "../../services/studentProfileService";

import { getAllScholarships } from "../../services/scholarshipData";

import { getStudentApplications } from "../../services/applicationService";

// Demo presentation scores for the current prototype.
// Replace with real recommendation and ML outputs later.
const DEMO_MATCH_SCORES = {
  "aicte-pragati-demo": 96,
  "national-scholarship-demo": 91,
  "maharashtra-state-scholarship-demo": 87,
};

const DEMO_SELECTION_CHANCES = {
  "aicte-pragati-demo": 85,
  "national-scholarship-demo": 78,
  "maharashtra-state-scholarship-demo": 74,
};

const STATUS_COLORS = {
  Saved: "#2563eb",
  "In Progress": "#f59e0b",
  Applied: "#8b5cf6",
  Approved: "#10b981",
  Rejected: "#f43f5e",
  "Needs Review": "#94a3b8",
};

function formatAmount(amount) {
  if (
    amount === null ||
    amount === undefined ||
    amount === "" ||
    !Number.isFinite(Number(amount))
  ) {
    return "Not provided";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function formatDeadline(deadline) {
  if (!deadline) return "To be announced";

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return deadline;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Reports() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isGenerating, setIsGenerating] = useState(false);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);

  const scholarships = getAllScholarships();

  // Load the current user's saved profile and tracker records.
  useEffect(() => {
    if (!user?.email) {
      setProfile(null);
      setApplications([]);
      return;
    }

    setProfile(getStudentProfile(user.email));
    setApplications(getStudentApplications(user.email));
  }, [user?.email]);

  const profileCompletion = profile ? getProfileCompletion(profile) : 0;

  const hasAcademicScore = String(profile?.currentScore ?? "").trim() !== "";

  const hasFamilyIncome =
    String(profile?.annualFamilyIncome ?? "").trim() !== "";

  const academicScoreLabel = hasAcademicScore
    ? `${profile.currentScore} ${profile.scoreType || ""}`.trim()
    : "Not entered";

  const familyIncomeLabel = hasFamilyIncome
    ? formatAmount(profile.annualFamilyIncome)
    : "Not entered";

  // Calculate application tracker totals.
  const trackerStats = useMemo(() => {
    const stats = {
      total: applications.length,
      saved: 0,
      inProgress: 0,
      applied: 0,
      approved: 0,
      rejected: 0,
      needsReview: 0,
    };

    applications.forEach((application) => {
      switch (application.status) {
        case "Saved":
          stats.saved += 1;
          break;

        case "In Progress":
          stats.inProgress += 1;
          break;

        case "Applied":
          stats.applied += 1;
          break;

        case "Approved":
          stats.approved += 1;
          break;

        case "Rejected":
          stats.rejected += 1;
          break;

        // Records from the earlier prototype may have this status.
        // Do not count them as confirmed official submissions.
        case "Submitted":
          stats.needsReview += 1;
          break;

        default:
          stats.saved += 1;
      }
    });

    return stats;
  }, [applications]);

  const applicationStatusData = useMemo(() => {
    const values = [
      ["Saved", trackerStats.saved],
      ["In Progress", trackerStats.inProgress],
      ["Applied", trackerStats.applied],
      ["Approved", trackerStats.approved],
      ["Rejected", trackerStats.rejected],
      ["Needs Review", trackerStats.needsReview],
    ];

    return values
      .filter(([, value]) => value > 0)
      .map(([label, value]) => ({
        label,
        value,
        color: STATUS_COLORS[label],
      }));
  }, [trackerStats]);

  // Build the recommendation overview from the shared data source.
  const recommendationRecords = useMemo(() => {
    return scholarships.map((scholarship) => ({
      ...scholarship,
      matchScore: DEMO_MATCH_SCORES[scholarship.id] ?? 75,
      selectionChance: DEMO_SELECTION_CHANCES[scholarship.id] ?? 60,
    }));
  }, [scholarships]);

  const peakDemoSelectionChance = useMemo(() => {
    if (recommendationRecords.length === 0) return 0;

    return Math.max(
      ...recommendationRecords.map(
        (scholarship) => scholarship.selectionChance,
      ),
    );
  }, [recommendationRecords]);

  const highestMatchScore = useMemo(() => {
    if (recommendationRecords.length === 0) return 0;

    return Math.max(
      ...recommendationRecords.map((scholarship) => scholarship.matchScore),
    );
  }, [recommendationRecords]);

  // Keep the report printable using the browser's print dialog.
  const handlePrint = () => {
    setIsGenerating(true);

    window.setTimeout(() => {
      setIsGenerating(false);
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Student Progress Summary
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic & Scholarship Report
          </h1>

          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Review your saved profile, scholarship records, and personal
            application tracker.
          </p>
        </div>

        <Button
          onClick={handlePrint}
          disabled={isGenerating}
          icon={Printer}
          className="shrink-0"
        >
          {isGenerating ? "Preparing Report..." : "Print / Export PDF Report"}
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Completion */}
        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Profile Strength
          </p>

          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-3xl font-extrabold text-slate-900">
              {profileCompletion}%
            </h2>

            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                profileCompletion === 100
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-amber-700 bg-amber-50"
              }`}
            >
              {profileCompletion === 100 ? "Complete" : "In Progress"}
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </Card>

        {/* Scholarships Listed */}
        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Scholarships Listed
          </p>

          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            {scholarships.length}
          </h2>

          <p className="text-xs font-semibold text-blue-600 mt-1 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            Current scholarship dataset
          </p>
        </Card>

        {/* Tracker Records */}
        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tracker Records
          </p>

          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            {trackerStats.total}
          </h2>

          <p className="text-xs font-semibold text-blue-600 mt-1">
            {trackerStats.saved} saved · {trackerStats.inProgress} in progress
          </p>
        </Card>

        {/* Marked Applied */}
        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Marked Applied
          </p>

          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            {trackerStats.applied}
          </h2>

          <p className="text-xs font-semibold text-purple-600 mt-1 flex items-center gap-1">
            <ClipboardList className="w-3.5 h-3.5" />
            {trackerStats.approved} approved · {trackerStats.rejected} rejected
          </p>
        </Card>
      </div>

      {/* Profile Analysis */}
      <Card className="p-6" hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Student Profile Overview
            </h2>

            <p className="text-xs text-slate-500 mt-0.5">
              Based on information currently saved in your profile
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/profile")}
            icon={ArrowRight}
          >
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Academic Score */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">
              Academic Performance
            </span>

            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              {academicScoreLabel}
            </h3>

            <span
              className={`inline-block font-semibold mt-1 ${
                hasAcademicScore ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {hasAcademicScore ? "Score entered" : "Add your academic score"}
            </span>
          </div>

          {/* Family Income */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">
              Annual Family Income
            </span>

            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              {familyIncomeLabel}
            </h3>

            <span
              className={`inline-block font-semibold mt-1 ${
                hasFamilyIncome ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {hasFamilyIncome ? "Added to profile" : "Add your family income"}
            </span>
          </div>

          {/* Completion */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">
              Profile Completeness
            </span>

            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              {profileCompletion}%
            </h3>

            <span
              className={`inline-block font-semibold mt-1 ${
                profileCompletion === 100
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            >
              {profileCompletion === 100
                ? "Required fields complete"
                : "More details can be added"}
            </span>
          </div>
        </div>
      </Card>

      {/* Recommendation Overview */}
      <Card className="p-6" hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Scholarship Recommendations Overview
            </h2>

            <p className="text-xs text-slate-500 mt-0.5">
              Scholarship records and their current demonstration scores
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/recommendations")}
            icon={ArrowRight}
          >
            All Recommendations
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          {recommendationRecords.length > 0 ? (
            recommendationRecords.map((scholarship) => (
              <div
                key={scholarship.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {scholarship.name}
                  </h3>

                  <p className="text-slate-500 mt-0.5">
                    {scholarship.provider} ·{" "}
                    {formatAmount(scholarship.benefitAmount)}
                    {scholarship.benefitPeriod
                      ? ` / ${scholarship.benefitPeriod}`
                      : ""}
                  </p>

                  <p className="text-slate-400 mt-1">
                    Deadline: {formatDeadline(scholarship.deadline)}
                  </p>
                </div>

                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold w-fit shrink-0">
                  {scholarship.matchScore}% Match
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 py-4">
              No scholarship records are available.
            </p>
          )}
        </div>

        <p className="text-[11px] text-slate-500 mt-4">
          Match scores are demo values in the current prototype. They are not
          generated by a trained machine-learning model.
        </p>
      </Card>

      {/* Prediction and Improvement Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selection Estimate */}
        <Card className="p-6" hover={false}>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                Selection Estimate
              </h2>

              <p className="text-xs text-slate-500 mt-1">Prototype estimate</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/prediction")}
              icon={ArrowRight}
            >
              Analyze
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
            <div className="w-28 h-28 shrink-0">
              <DonutChart
                value={peakDemoSelectionChance}
                maxValue={100}
                size={110}
                strokeWidth={12}
                primaryColor="#8b5cf6"
                centerValue={`${peakDemoSelectionChance}%`}
                centerLabel=""
              />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <h3 className="text-sm font-bold text-slate-900">
                Highest Displayed Estimate
              </h3>

              <p className="leading-relaxed">
                This is the highest sample selection estimate currently
                configured for the listed scholarships. It is a prototype
                display value, not a measured selection probability or a
                guarantee of receiving funding.
              </p>

              <p className="text-purple-700 font-semibold pt-1">
                Keep your profile information and required documents up to date.
              </p>
            </div>
          </div>
        </Card>

        {/* Improvement Roadmap */}
        <Card className="p-6" hover={false}>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Profile Improvement Opportunities
              </h2>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/improvements")}
              icon={ArrowRight}
            >
              Roadmap
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-800">
                  {hasAcademicScore
                    ? "Maintain Your Academic Records"
                    : "Add Your Academic Score"}
                </p>

                <p className="text-slate-500 mt-0.5">
                  {hasAcademicScore
                    ? "Keep your latest marksheets available."
                    : "Enter your current CGPA or percentage."}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile")}
              >
                Update
              </Button>
            </div>

            <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-800">
                  {hasFamilyIncome
                    ? "Prepare Income Documents"
                    : "Add Family Income"}
                </p>

                <p className="text-slate-500 mt-0.5">
                  {hasFamilyIncome
                    ? "Keep supporting documents ready when required."
                    : "Enter annual family income in your profile."}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile")}
              >
                Update
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Tracker Status */}
      <Card className="p-6" hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              Personal Application Tracker
            </h2>

            <p className="text-xs text-slate-500 mt-0.5">
              Distribution of records saved in your tracker
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/applications")}
            icon={ArrowRight}
          >
            Open Tracker
          </Button>
        </div>

        {applicationStatusData.length > 0 ? (
          <div className="max-w-md mx-auto">
            <DonutChart
              value={trackerStats.total}
              maxValue={Math.max(trackerStats.total, 1)}
              size={160}
              strokeWidth={14}
              primaryColor="#2563eb"
              centerValue={`${trackerStats.total}`}
              centerLabel="Records"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {applicationStatusData.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <span className="flex items-center gap-2 text-slate-600">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                  </span>

                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />

            <p className="text-sm font-semibold text-slate-700 mt-3">
              Your tracker is empty
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Save scholarships to start tracking your progress.
            </p>

            <Button
              className="mt-4"
              size="sm"
              onClick={() => navigate("/scholarships")}
            >
              Explore Scholarships
            </Button>
          </div>
        )}
      </Card>

      {/* Report Notice */}
      <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-500">
        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />

        <p className="leading-relaxed">
          <strong>Important:</strong> This report summarises the information
          saved in ScholarMate. Application statuses are maintained by the
          student and are not automatically confirmed by government portals.
          Scholarship names, benefits, deadlines, and recommendation scores
          should be checked against the applicable official scheme information.
        </p>
      </div>
    </div>
  );
}

export default Reports;
