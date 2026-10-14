import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Award,
  Calendar,
  Building2,
  TrendingUp,
  Target,
  CheckCircle2,
  UserRound,
  ArrowRight,
  ExternalLink,
  IndianRupee,
  Bookmark,
  AlertCircle,
} from "lucide-react";

import Card from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";

import { getAllScholarships } from "../../services/scholarshipData";

import {
  getStudentProfile,
  getProfileCompletion,
} from "../../services/studentProfileService";

import {
  addScholarshipToTracker,
  getStudentApplications,
} from "../../services/applicationService";

// Temporary demonstration values for the prototype.
const DEMO_RECOMMENDATIONS = {
  "aicte-pragati-demo": {
    matchScore: 96,
    selectionChance: 85,
    deadline: "30 Sep 2026",
    label: "Best Match",
  },
  "national-scholarship-demo": {
    matchScore: 91,
    selectionChance: 78,
    deadline: "15 Oct 2026",
    label: "Strong Match",
  },
  "maharashtra-state-scholarship-demo": {
    matchScore: 87,
    selectionChance: 74,
    deadline: "31 Oct 2026",
    label: "Good Match",
  },
};

const ALLOWED_OFFICIAL_HOSTS = [
  "scholarships.gov.in",
  "mahadbt2.maharashtra.gov.in",
];

function getOfficialApplyUrl(scholarship) {
  const candidate = scholarship?.officialApplyUrl;

  if (!candidate) return "";

  try {
    const url = new URL(candidate);

    const allowedHost = ALLOWED_OFFICIAL_HOSTS.some(
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

function Recommendations() {
  const { user } = useAuth();

  const scholarships = getAllScholarships();

  const [profile, setProfile] = useState(null);
  const [savedScholarshipIds, setSavedScholarshipIds] = useState(
    () => new Set(),
  );
  const [trackerMessages, setTrackerMessages] = useState({});

  // Load the student's profile and saved tracker records.
  useEffect(() => {
    if (!user?.email) {
      setProfile(null);
      setSavedScholarshipIds(new Set());
      return;
    }

    setProfile(getStudentProfile(user.email));

    const savedApplications = getStudentApplications(user.email);

    setSavedScholarshipIds(
      new Set(
        savedApplications
          .map((application) => application.scholarshipId)
          .filter(Boolean),
      ),
    );
  }, [user?.email]);

  const profileCompletion = profile ? getProfileCompletion(profile) : 0;

  const recommendations = scholarships
    .map((scholarship) => ({
      ...scholarship,
      ...(DEMO_RECOMMENDATIONS[scholarship.id] || {
        matchScore: 75,
        selectionChance: 60,
        deadline: scholarship.deadline || "To be announced",
        label: "Recommended",
      }),
      officialUrl: getOfficialApplyUrl(scholarship),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const averageMatch = recommendations.length
    ? Math.round(
        recommendations.reduce(
          (total, scholarship) => total + scholarship.matchScore,
          0,
        ) / recommendations.length,
      )
    : 0;

  const handleSaveToTracker = (scholarship) => {
    if (!user?.email) {
      setTrackerMessages((previous) => ({
        ...previous,
        [scholarship.id]: {
          type: "error",
          text: "Please log in before saving a scholarship.",
        },
      }));

      return;
    }

    try {
      const savedApplication = addScholarshipToTracker(scholarship, user.email);

      setSavedScholarshipIds((previous) => {
        const updated = new Set(previous);
        updated.add(savedApplication.scholarshipId);
        return updated;
      });

      setTrackerMessages((previous) => ({
        ...previous,
        [scholarship.id]: {
          type: "success",
          text: "Saved to your personal tracker.",
        },
      }));
    } catch (error) {
      setTrackerMessages((previous) => ({
        ...previous,
        [scholarship.id]: {
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "Unable to save the scholarship.",
        },
      }));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Recommendations
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Recommendations
        </h1>

        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Explore recommended scholarships, review their details, and continue
          your application on the official portal.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-5" hover>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Scholarships Matched
            </p>
            <Award className="w-5 h-5 text-blue-600" />
          </div>

          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {recommendations.length}
          </p>

          <p className="text-xs text-slate-500 mt-1">Listed opportunities</p>
        </Card>

        <Card className="p-5" hover>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average Match
            </p>
            <Target className="w-5 h-5 text-indigo-600" />
          </div>

          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {averageMatch}%
          </p>

          <p className="text-xs text-slate-500 mt-1">Displayed match score</p>
        </Card>

        <Card className="p-5" hover>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Profile Completion
            </p>
            <UserRound className="w-5 h-5 text-emerald-600" />
          </div>

          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {profileCompletion}%
          </p>

          <p className="text-xs text-slate-500 mt-1">Your saved profile</p>
        </Card>

        <Card className="p-5" hover>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Saved Scholarships
            </p>
            <Bookmark className="w-5 h-5 text-purple-600" />
          </div>

          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {savedScholarshipIds.size}
          </p>

          <Link
            to="/applications"
            className="text-xs font-semibold text-blue-600 mt-1 inline-flex items-center gap-1"
          >
            Open My Tracker
            <ArrowRight className="w-3 h-3" />
          </Link>
        </Card>
      </div>

      {/* Profile Completion Prompt */}
      {profileCompletion < 100 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Improve Your Scholarship Profile
              </h2>

              <p className="text-xs text-slate-600 mt-1">
                Your profile is {profileCompletion}% complete. Add missing
                details to help assess more scholarship criteria.
              </p>

              <div className="w-full sm:w-64 h-2 bg-blue-100 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          </div>

          <Link
            to="/profile"
            className="inline-flex items-center justify-center gap-2 text-xs font-bold text-blue-700 bg-white border border-blue-200 px-4 py-2.5 rounded-xl hover:bg-blue-50 transition"
          >
            Complete Profile
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Recommendation Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Recommended Scholarships
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Review each opportunity and choose the next step.
          </p>
        </div>

        <Link
          to="/scholarships"
          className="text-xs font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5"
        >
          Explore All Scholarships
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {recommendations.length > 0 ? (
        <div className="space-y-5">
          {recommendations.map((scholarship, index) => {
            const isSaved = savedScholarshipIds.has(scholarship.id);
            const message = trackerMessages[scholarship.id];

            return (
              <Card
                key={scholarship.id}
                className="p-5 sm:p-6 transition-all hover:shadow-md"
                hover
              >
                {/* Heading */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-extrabold text-sm text-blue-700 shrink-0">
                      {index + 1}
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {scholarship.label}
                      </span>

                      <h3 className="text-lg font-bold text-slate-900">
                        {scholarship.name}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        {scholarship.provider}
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs font-semibold text-slate-500">
                      Match Score
                    </p>

                    <p className="text-3xl font-extrabold text-blue-700 mt-0.5">
                      {scholarship.matchScore}%
                    </p>
                  </div>
                </div>

                {/* Match Progress */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-600">
                      Profile Match
                    </span>

                    <span className="font-bold text-blue-700">
                      {scholarship.matchScore}%
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all"
                      style={{
                        width: `${scholarship.matchScore}%`,
                      }}
                    />
                  </div>
                </div>

                <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                  {scholarship.description}
                </p>

                {/* Benefit, Deadline, and Selection Chance */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500">
                      <IndianRupee className="w-4 h-4" />
                      <span className="text-xs font-semibold">
                        Scholarship Benefit
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-900 mt-2">
                      {formatAmount(scholarship.benefitAmount)}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1">
                      {scholarship.benefitPeriod || "Period not specified"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-semibold">
                        Application Deadline
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-900 mt-2">
                      {scholarship.deadline}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1">
                      Check the portal for current dates.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-semibold">
                        Selection Chance
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-900 mt-2">
                      {scholarship.selectionChance}%
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1">
                      Demo estimate
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-100">
                  <Link
                    to={`/scholarships/${scholarship.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 text-slate-700 px-4 py-2.5 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {isSaved ? (
                    <Link
                      to="/applications"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 text-xs font-bold hover:bg-emerald-100 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Saved — Open Tracker
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSaveToTracker(scholarship)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 text-blue-700 bg-white px-4 py-2.5 text-xs font-bold hover:bg-blue-50 transition"
                    >
                      <Bookmark className="w-4 h-4" />
                      Save to My Tracker
                    </button>
                  )}

                  {scholarship.officialUrl ? (
                    <a
                      href={scholarship.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2.5 text-xs font-bold hover:bg-blue-700 transition"
                    >
                      Apply on Official Website
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-400 px-4 py-2.5 text-xs font-bold cursor-not-allowed"
                    >
                      Official Link Unavailable
                    </button>
                  )}
                </div>

                {message && (
                  <p
                    role={message.type === "error" ? "alert" : "status"}
                    className={`text-xs mt-3 flex items-start gap-2 ${
                      message.type === "error"
                        ? "text-rose-600"
                        : "text-emerald-700"
                    }`}
                  >
                    {message.type === "error" ? (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    )}

                    {message.text}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center" hover={false}>
          <Award className="w-9 h-9 text-slate-400 mx-auto mb-3" />

          <h3 className="text-base font-bold text-slate-900">
            No recommendations available
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            Add scholarship records to your shared dataset to display
            recommendations here.
          </p>

          <Link
            to="/scholarships"
            className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-blue-700"
          >
            Browse Scholarships
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>
      )}

      <p className="text-[11px] text-slate-500 leading-relaxed">
        Match scores and selection chances are currently prototype values.
        Opening an official portal does not submit an application or change your
        tracker status. Update your status manually after applying.
      </p>
    </div>
  );
}

export default Recommendations;
