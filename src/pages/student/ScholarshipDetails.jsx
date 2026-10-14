import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Award,
  TrendingUp,
  GraduationCap,
  Clock,
} from "lucide-react";

import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

import { getScholarshipById } from "../../services/scholarshipData";

// Temporary presentation data for the prototype.
// Replace these sample details with verified scholarship records later.
const DEMO_DETAILS = {
  "aicte-pragati-demo": {
    category: "Engineering",
    matchScore: 96,
    selectionChance: 85,
    deadline: "30 Sep 2026",

    eligibility: [
      "Student must be pursuing an eligible technical degree or diploma.",
      "Student must be enrolled in a recognized educational institution.",
      "Family income and other conditions must meet the applicable scheme rules.",
      "Student must meet the academic and admission requirements.",
    ],

    benefits: [
      "Financial assistance for eligible educational expenses.",
      "Support for college-related learning resources.",
      "Assistance subject to the applicable scholarship conditions.",
      "Renewal subject to the relevant scheme rules.",
    ],

    documents: [
      "Aadhaar Card or accepted identity proof",
      "Current College ID",
      "Admission Letter or Bonafide Certificate",
      "Previous Academic Marksheet",
      "Family Income Certificate",
      "Bank Account Details",
    ],
  },

  "national-scholarship-demo": {
    category: "National",
    matchScore: 91,
    selectionChance: 78,
    deadline: "15 Oct 2026",

    eligibility: [
      "Student must be enrolled in an eligible educational course.",
      "Academic performance must satisfy the applicable scheme rules.",
      "Family income must satisfy the relevant scholarship requirements.",
      "Student must provide the required application information.",
    ],

    benefits: [
      "Financial assistance towards educational expenses.",
      "Support for eligible students pursuing further education.",
      "Benefits according to the applicable scheme guidelines.",
      "Continuation subject to the relevant renewal conditions.",
    ],

    documents: [
      "Identity Proof",
      "College ID or Admission Proof",
      "Previous Academic Marksheet",
      "Family Income Certificate",
      "Bank Account Details",
      "Recent Passport-size Photograph",
    ],
  },

  "maharashtra-state-scholarship-demo": {
    category: "Maharashtra",
    matchScore: 87,
    selectionChance: 74,
    deadline: "31 Oct 2026",

    eligibility: [
      "Student must satisfy the applicable Maharashtra scholarship rules.",
      "Domicile requirements depend on the specific scholarship scheme.",
      "Academic performance must meet the relevant conditions.",
      "Income and category requirements depend on the applicable scheme.",
    ],

    benefits: [
      "Financial assistance for eligible educational expenses.",
      "Support for students pursuing higher education.",
      "Benefits according to the applicable state scheme.",
      "Renewal according to the relevant scholarship requirements.",
    ],

    documents: [
      "Identity Proof",
      "Domicile Certificate, if required",
      "College ID or Admission Proof",
      "Previous Academic Marksheet",
      "Income or Category Certificate, if required",
      "Bank Account Details",
    ],
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

    const isAllowedHost = ALLOWED_OFFICIAL_HOSTS.some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    );

    if (url.protocol !== "https:" || !isAllowedHost) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

function formatAmount(amount, period) {
  if (
    amount === null ||
    amount === undefined ||
    amount === "" ||
    !Number.isFinite(Number(amount))
  ) {
    return "Not specified";
  }

  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount));

  return period ? `${formatted} / ${period}` : formatted;
}

function getDeadlineText(deadline) {
  if (!deadline) return "To be announced";
  return deadline;
}

function ScholarshipDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Load the scholarship selected by its URL ID.
  const scholarship = getScholarshipById(id);
  const demoDetails = DEMO_DETAILS[id];
  const officialApplyUrl = getOfficialApplyUrl(scholarship);

  // Handle invalid or missing scholarship IDs.
  if (!scholarship) {
    return (
      <div className="space-y-5 animate-fadeIn">
        <Link
          to="/scholarships"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scholarships
        </Link>

        <Card className="p-8 text-center" hover={false}>
          <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-3" />

          <h1 className="text-xl font-bold text-slate-900">
            Scholarship Not Found
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            This scholarship may have been removed or the requested link may be
            incorrect.
          </p>

          <Button className="mt-5" onClick={() => navigate("/scholarships")}>
            Browse Scholarships
          </Button>
        </Card>
      </div>
    );
  }

  const category = demoDetails?.category || "Scholarship";
  const matchScore = demoDetails?.matchScore ?? 75;
  const selectionChance = demoDetails?.selectionChance ?? 60;

  const deadline = getDeadlineText(
    demoDetails?.deadline || scholarship.deadline,
  );

  const eligibility = demoDetails?.eligibility || [
    "Review the academic requirements for this scholarship.",
    "Check the applicable family income requirements.",
    "Complete the required student and educational details.",
    "Provide documents specified by the scholarship provider.",
  ];

  const benefits = demoDetails?.benefits || [
    "Financial support according to the scholarship conditions.",
    "Assistance towards eligible educational expenses.",
    "Benefits based on the published scholarship scheme.",
    "Renewal subject to the applicable rules.",
  ];

  const documents =
    scholarship.requiredDocuments?.length > 0
      ? scholarship.requiredDocuments
      : demoDetails?.documents || [
          "Identity Proof",
          "College ID or Admission Proof",
          "Academic Marksheet",
          "Family Income Certificate, if required",
          "Bank Account Details",
          "Passport-size Photograph, if required",
        ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link
          to="/scholarships"
          className="hover:text-blue-600 transition flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Scholarships
        </Link>

        <span>/</span>

        <span className="text-slate-400">{category}</span>

        <span>/</span>

        <span className="text-slate-800 font-semibold truncate">
          {scholarship.name}
        </span>
      </nav>

      {/* Hero Header */}
      <Card className="p-6 sm:p-8" hover={false}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                {category}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{scholarship.provider}</span>

                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
              {scholarship.name}
            </h1>

            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              {scholarship.description}
            </p>
          </div>

          {/* Match Score */}
          <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 text-center min-w-44 shrink-0 shadow-sm">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              AI Match Score
            </span>

            <p className="text-4xl font-extrabold text-emerald-600 mt-1 tracking-tight">
              {matchScore}%
            </p>

            <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mt-1.5">
              {matchScore >= 90
                ? "Excellent Profile Match"
                : matchScore >= 80
                  ? "Strong Profile Match"
                  : "Good Profile Match"}
            </span>
          </div>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Award Amount
              </p>

              <p className="text-base font-bold text-slate-900 mt-0.5">
                {formatAmount(
                  scholarship.benefitAmount,
                  scholarship.benefitPeriod,
                )}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Application Deadline
              </p>

              <p className="text-base font-bold text-slate-900 mt-0.5">
                {deadline}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Selection Probability
              </p>

              <p className="text-base font-bold text-purple-700 mt-0.5">
                {selectionChance}% High Chance
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card className="p-6" hover={false}>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3">
              About This Scholarship
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              {scholarship.description}
            </p>
          </Card>

          {/* Eligibility */}
          <Card className="p-6" hover={false}>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Eligibility Criteria
            </h2>

            <ul className="space-y-3">
              {eligibility.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-slate-50/60 p-3 rounded-xl border border-slate-100"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </span>

                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Benefits */}
          <Card className="p-6" hover={false}>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Benefits & Financial Assistance
            </h2>

            <ul className="space-y-3">
              {benefits.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-slate-50/60 p-3 rounded-xl border border-slate-100"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </span>

                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Documents */}
          <Card className="p-6" hover={false}>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Required Document Checklist
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((document, index) => (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center gap-3 text-xs sm:text-sm text-slate-700"
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />

                  <span className="font-medium">{document}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Analysis */}
          <Card className="p-6" hover={false}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-600" />

              <h2 className="text-base font-bold text-slate-900">
                AI Profile Match Analysis
              </h2>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Compare the displayed recommendation scores and your academic
              profile.
            </p>

            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  Profile Match
                </span>

                <span className="font-bold text-emerald-600">
                  {matchScore}%
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${matchScore}%` }}
                />
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  Selection Probability
                </span>

                <span className="font-bold text-blue-600">
                  {selectionChance}%
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${selectionChance}%` }}
                />
              </div>
            </div>

            <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3.5 mt-5">
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>ScholarMate Insight:</strong> Review your academic,
                financial, and educational information to identify scholarship
                opportunities that may suit you.
              </p>
            </div>
          </Card>

          {/* Application */}

          <Card
            className="p-6 bg-gradient-to-b from-white to-slate-50 border-slate-200"
            hover={false}
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />

              <h2 className="text-base font-bold text-slate-900">
                Ready to Apply?
              </h2>
            </div>

            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Continue to the official scholarship portal to find the scheme and
              complete its application requirements.
            </p>

            {officialApplyUrl ? (
              <a
                href={officialApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-3 text-sm font-bold hover:bg-blue-700 transition"
              >
                Apply on Official Website
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <Button className="w-full mt-5" size="lg" disabled>
                Official Link Unavailable
              </Button>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-3">
              <Clock className="w-3.5 h-3.5" />
              The official portal opens in a new tab.
            </div>

            <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
              ScholarMate does not submit the official application. Return here
              afterward to update your personal application tracker.
            </p>
          </Card>

          {/* Back Navigation */}
          <Link
            to="/scholarships"
            className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-slate-600 hover:text-blue-700 py-3 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Scholarships
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ScholarshipDetails;
