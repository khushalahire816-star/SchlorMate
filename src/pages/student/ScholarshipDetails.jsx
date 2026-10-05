import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  Sparkles,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Award,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

function ScholarshipDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const scholarship = {
    id: id,
    name: "AICTE Pragati Scholarship",
    provider: "AICTE",
    amount: "₹50,000 / year",
    deadline: "30 Sep 2026",
    category: "Engineering",
    match: 96,
    successChance: 85,

    description:
      "The AICTE Pragati Scholarship is a flagship scheme implemented by the All India Council for Technical Education to provide financial assistance to meritorious students pursuing technical degree or diploma programs. The scheme encourages higher technical education and supports educational expenses for deserving scholars across India.",

    eligibility: [
      "Student must be pursuing an approved technical diploma or degree program.",
      "Student must be admitted to an AICTE-approved institution in the current academic year.",
      "Family annual income from all sources must not exceed ₹8,00,000.",
      "Student must meet the required minimum academic criteria with no active backlogs.",
    ],

    benefits: [
      "Financial assistance of ₹50,000 per annum towards college fee and learning resources.",
      "Direct Benefit Transfer (DBT) deposited straight into the verified student bank account.",
      "Annual renewal subject to maintaining satisfactory academic progression.",
      "National recognition and credentials on the official National Scholarship Portal.",
    ],

    documents: [
      "Aadhaar Card (Identity & Address Proof)",
      "Current College ID & Admission Letter",
      "Previous Year Official Marksheet",
      "Competent Authority Income Certificate",
      "Bank Passbook / Cancelled Cheque",
      "Recent Passport Size Photograph",
    ],
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/scholarships" className="hover:text-blue-600 transition flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Scholarships
        </Link>
        <span>/</span>
        <span className="text-slate-400">{scholarship.category}</span>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate">{scholarship.name}</span>
      </nav>

      {/* Hero Header Card */}
      <Card className="p-6 sm:p-8" hover={false}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                {scholarship.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{scholarship.provider}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
              {scholarship.name}
            </h1>

            <p className="text-slate-500 text-xs sm:text-sm">
              Official government technical education opportunity verified by the ScholarMate AI engine.
            </p>
          </div>

          {/* Match Score Badge Box */}
          <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 text-center min-w-44 shrink-0 shadow-xs">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> AI Match Score
            </span>
            <p className="text-4xl font-extrabold text-emerald-600 mt-1 tracking-tight">
              {scholarship.match}%
            </p>
            <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mt-1.5">
              Excellent Profile Match
            </span>
          </div>
        </div>

        {/* Important Details Bar */}
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
                {scholarship.amount}
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
                {scholarship.deadline}
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
                {scholarship.successChance}% High Chance
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description, Eligibility, Benefits, Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card className="p-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3">
              About This Scholarship
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {scholarship.description}
            </p>
          </Card>

          {/* Eligibility Criteria */}
          <Card className="p-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Eligibility Criteria
            </h2>

            <ul className="space-y-3">
              {scholarship.eligibility.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Benefits */}
          <Card className="p-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Benefits & Financial Allowances
            </h2>

            <ul className="space-y-3">
              {scholarship.benefits.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Required Documents */}
          <Card className="p-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Required Documentation Checklist
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scholarship.documents.map((document, index) => (
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

        {/* Right Column: AI Analysis & Application CTA */}
        <div className="space-y-6">
          {/* AI Analysis Sidebar Card */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">AI Profile Match Analysis</h2>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Calculated dynamically against your verified student records and academic performance.
            </p>

            {/* Profile Match Bar */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600">Profile Match</span>
                <span className="font-bold text-emerald-600">{scholarship.match}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${scholarship.match}%` }}
                ></div>
              </div>
            </div>

            {/* Selection Probability Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600">Selection Probability</span>
                <span className="font-bold text-blue-600">{scholarship.successChance}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${scholarship.successChance}%` }}
                ></div>
              </div>
            </div>

            {/* AI Insight Box */}
            <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3.5 mt-5">
              <p className="text-xs text-blue-800 leading-relaxed">
                💡 <strong>AI Recommendation:</strong> Your engineering enrollment and verified family income meet the tier criteria for maximum consideration.
              </p>
            </div>
          </Card>

          {/* Apply Action Card */}
          <Card className="p-6 bg-gradient-to-b from-white to-slate-50 border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Ready to Submit?</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Verify your application details and required attachments before the 30 Sep deadline.
            </p>

            <Button
              className="w-full mt-5"
              size="lg"
              onClick={() => navigate(`/scholarships/${id}/apply`)}
            >
              Start Application Form
            </Button>

            <p className="text-[11px] text-center text-slate-400 mt-3">
              Application is completely free for verified students.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ScholarshipDetails;
