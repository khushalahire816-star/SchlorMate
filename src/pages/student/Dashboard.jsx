import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  GraduationCap,
  ClipboardList,
  UserCheck,
  Sparkles,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Award,
  Compass,
  ExternalLink,
  Bookmark,
  IndianRupee,
} from "lucide-react";

import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import BarChart from "../../components/charts/BarChart";
import PieChart from "../../components/charts/PieChart";
import DonutChart from "../../components/charts/DonutChart";

import { useAuth } from "../../context/AuthContext";

import { getAllScholarships } from "../../services/scholarshipData";

import { getStudentApplications } from "../../services/applicationService";

import {
  getStudentProfile,
  getProfileCompletion,
} from "../../services/studentProfileService";

// Temporary prototype scores used by the recommendation interface.
// Replace them with real recommendation/model results in the future.
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

const OFFICIAL_HOSTS = ["scholarships.gov.in", "mahadbt2.maharashtra.gov.in"];

const CATEGORY_COLORS = [
  "#2563eb",
  "#0d9488",
  "#6366f1",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
];

const STATUS_COLORS = {
  Saved: "#2563eb",
  "In Progress": "#f59e0b",
  Applied: "#8b5cf6",
  Approved: "#10b981",
  Rejected: "#f43f5e",
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";

  return "Good evening";
}

function formatAmount(amount) {
  if (
    amount === null ||
    amount === undefined ||
    amount === "" ||
    !Number.isFinite(Number(amount))
  ) {
    return "Not specified";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function getOfficialApplyUrl(scholarship) {
  const candidate = scholarship?.officialApplyUrl;

  if (!candidate) return "";

  try {
    const url = new URL(candidate);

    const allowedHost = OFFICIAL_HOSTS.some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    );

    if (url.protocol !== "https:" || !allowedHost) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

function parseDeadline(deadline) {
  if (!deadline) return null;

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);

  return date;
}

function getDeadlineInfo(deadline) {
  const date = parseDeadline(deadline);

  if (!date) {
    return {
      daysLeft: null,
      label: "To be announced",
      isUpcoming: false,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const difference = Math.ceil(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (difference < 0) {
    return {
      daysLeft: difference,
      label: "Deadline passed",
      isUpcoming: false,
    };
  }

  if (difference === 0) {
    return {
      daysLeft: 0,
      label: "Closes today",
      isUpcoming: true,
    };
  }

  return {
    daysLeft: difference,
    label: `${difference} day${difference === 1 ? "" : "s"} left`,
    isUpcoming: true,
  };
}

function formatDeadlineDate(deadline) {
  const date = parseDeadline(deadline);

  if (!date) return "To be announced";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);

  // Read the shared scholarship data.
  const scholarshipRecords = getAllScholarships();

  // Load saved student data when the logged-in account changes.
  useEffect(() => {
    if (!user?.email) {
      setProfile(null);
      setApplications([]);
      return;
    }

    setProfile(getStudentProfile(user.email));
    setApplications(getStudentApplications(user.email));
  }, [user?.email]);

  const studentName = profile?.fullName || user?.name || "Student";

  const profileCompletion = profile ? getProfileCompletion(profile) : 0;

  // Calculate tracker metrics from saved applications.
  const applicationCounts = useMemo(() => {
    const counts = {
      saved: 0,
      inProgress: 0,
      applied: 0,
      approved: 0,
      rejected: 0,
      legacy: 0,
    };

    applications.forEach((application) => {
      switch (application.status) {
        case "Saved":
          counts.saved += 1;
          break;

        case "In Progress":
          counts.inProgress += 1;
          break;

        case "Applied":
          counts.applied += 1;
          break;

        case "Approved":
          counts.approved += 1;
          break;

        case "Rejected":
          counts.rejected += 1;
          break;

        // Old demo records are not automatically treated as
        // confirmed official submissions.
        case "Submitted":
          counts.legacy += 1;
          break;

        default:
          counts.saved += 1;
      }
    });

    return counts;
  }, [applications]);

  // Prepare scholarship cards using the central dataset.
  const scholarships = useMemo(() => {
    return scholarshipRecords.map((scholarship) => {
      const deadlineInfo = getDeadlineInfo(scholarship.deadline);

      return {
        ...scholarship,
        match: DEMO_MATCH_SCORES[scholarship.id] ?? 75,
        amount: scholarship.benefitAmount,
        category: scholarship.category || scholarship.provider || "General",
        deadlineDisplay: formatDeadlineDate(scholarship.deadline),
        deadlineInfo,
        officialUrl: getOfficialApplyUrl(scholarship),
      };
    });
  }, [scholarshipRecords]);

  // Use the current shared scholarship records to group the chart.
  const categoryBarData = useMemo(() => {
    const categoryCounts = {};

    scholarships.forEach((scholarship) => {
      const category = scholarship.category || "Other";

      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    return Object.entries(categoryCounts).map(([label, value], index) => ({
      label,
      shortLabel: label.length > 9 ? `${label.slice(0, 8)}…` : label,
      value,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
      subtext: `${value} scholarship${value === 1 ? "" : "s"}`,
    }));
  }, [scholarships]);

  // Show only statuses that currently have tracker records.
  const applicationPieData = useMemo(() => {
    const statusCounts = {
      Saved: applicationCounts.saved,
      "In Progress": applicationCounts.inProgress,
      Applied: applicationCounts.applied,
      Approved: applicationCounts.approved,
      Rejected: applicationCounts.rejected,
    };

    return Object.entries(statusCounts)
      .filter(([, value]) => value > 0)
      .map(([label, value]) => ({
        label,
        value,
        color: STATUS_COLORS[label],
      }));
  }, [applicationCounts]);

  const upcomingDeadlines = useMemo(() => {
    return scholarships
      .filter((scholarship) => scholarship.deadlineInfo.isUpcoming)
      .sort((a, b) => a.deadlineInfo.daysLeft - b.deadlineInfo.daysLeft)
      .slice(0, 3);
  }, [scholarships]);

  // Prototype selection estimate. This is not produced by an ML model.
  const averageDemoSelectionChance = useMemo(() => {
    const chances = scholarships
      .map((scholarship) => DEMO_SELECTION_CHANCES[scholarship.id])
      .filter((value) => Number.isFinite(value) && value >= 0 && value <= 100);

    if (chances.length === 0) return 0;

    return Math.round(
      chances.reduce((total, value) => total + value, 0) / chances.length,
    );
  }, [scholarships]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-blue-200 border border-white/10 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Scholarship Recommendations
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {studentName} 👋
          </h1>

          <p className="text-blue-100 text-sm sm:text-base mt-2 leading-relaxed">
            Here's an overview of your scholarship opportunities, profile
            completion, and personal application tracker.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <Button
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
            onClick={() => navigate("/scholarships")}
            icon={Compass}
          >
            Explore Scholarships
          </Button>

          <Button
            className="bg-white text-blue-900 hover:bg-blue-50 border-0 font-bold"
            onClick={() => navigate("/recommendations")}
            icon={Sparkles}
          >
            View AI Matches
          </Button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Available Scholarships */}
        <Card
          className="p-5 sm:p-6 cursor-pointer"
          hover
          onClick={() => navigate("/scholarships")}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Scholarships Listed
              </p>

              <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {scholarships.length}
              </h2>

              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-600">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Browse available records</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/80 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Applied */}
        <Card
          className="p-5 sm:p-6 cursor-pointer"
          hover
          onClick={() => navigate("/applications")}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Marked Applied
              </p>

              <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {applicationCounts.applied}
              </h2>

              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-600">
                <ClipboardList className="w-3.5 h-3.5" />
                <span>
                  {applicationCounts.approved} approved ·{" "}
                  {applicationCounts.inProgress} in progress
                </span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/80 shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Profile Completion */}
        <Card
          className="p-5 sm:p-6 cursor-pointer"
          hover
          onClick={() => navigate("/profile")}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Profile Completion
              </p>

              <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {profileCompletion}%
              </h2>

              <div
                className={`flex items-center gap-1.5 mt-2 text-xs font-semibold ${
                  profileCompletion === 100
                    ? "text-emerald-600"
                    : "text-amber-600"
                }`}
              >
                {profileCompletion === 100 ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}

                <span>
                  {profileCompletion === 100
                    ? "Required fields complete"
                    : "Complete your profile"}
                </span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/80 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Demo Success Estimate */}
        <Card
          className="p-5 sm:p-6 cursor-pointer"
          hover
          onClick={() => navigate("/prediction")}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Success Chance
              </p>

              <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {averageDemoSelectionChance}%
              </h2>

              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-purple-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Prototype estimate</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/80 shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Profile and Category Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Completion Donut */}
        <Card className="p-6 flex flex-col justify-between" hover>
          <div>
            <DonutChart
              value={profileCompletion}
              title="Profile Readiness"
              subtitle="Based on required profile fields"
              centerLabel="Profile Score"
              centerValue={`${profileCompletion}%`}
              size={180}
              strokeWidth={16}
              primaryColor="#2563eb"
            />

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Academic Score
                </span>

                <span className="font-semibold text-slate-900">
                  {profile?.currentScore ? "Added" : "Missing"}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Family Income
                </span>

                <span className="font-semibold text-slate-900">
                  {profile?.annualFamilyIncome ? "Added" : "Missing"}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  College Details
                </span>

                <span className="font-semibold text-slate-900">
                  {profile?.institutionName ? "Added" : "Missing"}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => navigate("/profile")}
          >
            Update Student Profile
          </Button>
        </Card>

        {/* Scholarship Category Bar Chart */}
        <Card className="p-6 lg:col-span-2 flex flex-col justify-between" hover>
          <div>
            <div className="flex items-center justify-between mb-2 gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Scholarships by Category / Provider
                </h3>

                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison using the current scholarship dataset
                </p>
              </div>

              <Link
                to="/scholarships"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 shrink-0"
              >
                Explore
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {categoryBarData.length > 0 ? (
              <div className="pt-2">
                <BarChart
                  data={categoryBarData}
                  height={210}
                  valueSuffix=" scholarships"
                />
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-slate-500">
                No scholarship records available.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Total records: <strong>{scholarships.length}</strong>
            </span>

            <span className="font-semibold text-blue-600">
              Shared scholarship dataset
            </span>
          </div>
        </Card>
      </div>

      {/* 4. Recommendations and Application Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Scholarships */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Recommended Scholarships
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Opportunities from your shared scholarship dataset.
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/recommendations")}
              icon={ArrowRight}
              className="text-blue-600 font-semibold"
            >
              View All
            </Button>
          </div>

          <div className="space-y-3.5">
            {scholarships.length > 0 ? (
              scholarships.slice(0, 3).map((scholarship) => (
                <Card
                  key={scholarship.id}
                  className="p-5 border-l-4 border-l-blue-600 transition-all hover:shadow-md"
                  hover
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {scholarship.category}
                        </span>

                        <span className="text-xs text-slate-400 font-medium">
                          Provided by {scholarship.provider}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {scholarship.name}
                      </h3>
                    </div>

                    <div className="shrink-0">
                      <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-700 px-3 py-1 rounded-full text-xs font-extrabold">
                        <Sparkles className="w-3.5 h-3.5" />
                        {scholarship.match}% AI Match
                      </div>

                      <p className="text-[10px] text-slate-400 mt-1 text-right">
                        Demo score
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <Award className="w-4 h-4 text-blue-600 shrink-0" />

                      <div>
                        <p className="text-[11px] text-slate-400">
                          Listed Benefit
                        </p>

                        <p className="font-bold text-slate-800">
                          {formatAmount(scholarship.benefitAmount)}
                          {scholarship.benefitPeriod
                            ? ` / ${scholarship.benefitPeriod}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <Calendar className="w-4 h-4 text-amber-600 shrink-0" />

                      <div>
                        <p className="text-[11px] text-slate-400">
                          Listed Deadline
                        </p>

                        <p className="font-bold text-slate-800">
                          {scholarship.deadlineDisplay}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-2">
                    <span
                      className={`text-xs font-semibold flex items-center gap-1 ${
                        scholarship.deadlineInfo.isUpcoming
                          ? "text-amber-600"
                          : "text-slate-500"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />

                      {scholarship.deadlineInfo.label}
                    </span>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/scholarships/${scholarship.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {scholarship.officialUrl && (
                        <a
                          href={scholarship.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
                        >
                          Official Portal
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center" hover={false}>
                <GraduationCap className="w-8 h-8 text-slate-400 mx-auto" />

                <h3 className="text-base font-bold text-slate-900 mt-3">
                  No scholarships available
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Add records to your scholarship dataset to display
                  recommendations here.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Application Tracker and Upcoming Deadlines */}
        <div className="space-y-6">
          {/* Tracker Status Chart */}
          <Card className="p-6" hover>
            <PieChart
              data={applicationPieData}
              title="My Tracker Status"
              subtitle="Distribution of your saved tracker records"
              size={170}
            />

            {applicationPieData.length === 0 && (
              <p className="text-xs text-slate-500 text-center mt-2">
                Save scholarships to start tracking your progress.
              </p>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs gap-3">
              <span className="text-slate-500">
                Total Records: <strong>{applications.length}</strong>
              </span>

              <Link
                to="/applications"
                className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Open Tracker
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {applicationCounts.legacy > 0 && (
              <p className="text-[11px] text-amber-700 mt-3">
                {applicationCounts.legacy} older record(s) need a status review.
              </p>
            )}
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="p-6" hover>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Upcoming Deadlines
                </h3>

                <p className="text-xs text-slate-500">
                  Based on the current scholarship records
                </p>
              </div>

              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3.5">
                {upcomingDeadlines.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800">
                        {scholarship.name}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {scholarship.deadlineDisplay}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                        scholarship.deadlineInfo.daysLeft <= 7
                          ? "text-rose-600 bg-rose-50 border border-rose-100"
                          : "text-amber-600 bg-amber-50 border border-amber-100"
                      }`}
                    >
                      {scholarship.deadlineInfo.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-5 text-center">
                <Calendar className="w-7 h-7 text-slate-300 mx-auto" />

                <p className="text-xs font-semibold text-slate-600 mt-2">
                  No upcoming deadlines listed
                </p>

                <p className="text-[11px] text-slate-400 mt-1">
                  Check scholarship details for updates.
                </p>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => navigate("/scholarships")}
            >
              Browse All Opportunities
            </Button>
          </Card>
        </div>
      </div>

      {/* Tracker Shortcut */}
      <Card
        className="p-5 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100"
        hover={false}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center shrink-0">
              <Bookmark className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Manage Your Scholarship Journey
              </h3>

              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Save opportunities, open the official portals, and manually
                update your application progress.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => navigate("/applications")}
            icon={ArrowRight}
          >
            Open My Tracker
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
