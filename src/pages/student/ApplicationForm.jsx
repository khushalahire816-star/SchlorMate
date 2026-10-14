import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  GraduationCap,
  Building2,
  Calendar,
  IndianRupee,
  Info,
} from "lucide-react";

import Card from "../../components/common/Card";

import { getScholarshipById } from "../../services/scholarshipData";

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

function ApplicationForm() {
  const { id } = useParams();

  const scholarship = getScholarshipById(id);
  const officialApplyUrl = getOfficialApplyUrl(scholarship);

  if (!scholarship) {
    return (
      <div className="max-w-3xl mx-auto space-y-5 animate-fadeIn">
        <Card className="p-8 text-center" hover={false}>
          <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-3" />

          <h1 className="text-xl font-bold text-slate-900">
            Scholarship Not Found
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            This scholarship could not be found. Please select an opportunity
            from the scholarship list.
          </p>

          <Link
            to="/scholarships"
            className="inline-flex items-center justify-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Scholarships
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Back Navigation */}
      <Link
        to={`/scholarships/${scholarship.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Scholarship Details
      </Link>

      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
          <GraduationCap className="w-3.5 h-3.5" />
          Official Scholarship Application
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
          Continue to the Official Portal
        </h1>

        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          ScholarMate helps you discover scholarships and prepare your
          application. The actual application must be completed on the
          scholarship provider's official website.
        </p>
      </div>

      {/* Selected Scholarship */}
      <Card className="p-5 sm:p-6" hover={false}>
        <h2 className="text-lg font-bold text-slate-900">{scholarship.name}</h2>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
          <Building2 className="w-4 h-4" />
          {scholarship.provider}
        </div>

        <p className="text-sm text-slate-600 mt-4 leading-relaxed">
          {scholarship.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <IndianRupee className="w-4 h-4" />
              Listed Scholarship Benefit
            </div>

            <p className="text-base font-bold text-slate-900 mt-2">
              {formatAmount(scholarship.benefitAmount)}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              {scholarship.benefitPeriod || "Period not specified"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Calendar className="w-4 h-4" />
              Listed Deadline
            </div>

            <p className="text-base font-bold text-slate-900 mt-2">
              {scholarship.deadline || "To be announced"}
            </p>
          </div>
        </div>
      </Card>

      {/* Application Instructions */}
      <Card className="p-5 sm:p-6" hover={false}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              What should you do next?
            </h2>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {scholarship.applicationInstructions ||
                "Open the official scholarship portal, find the relevant scheme, and review its current eligibility and application instructions."}
            </p>

            <ol className="list-decimal pl-5 mt-4 space-y-2 text-sm text-slate-600">
              <li>
                Open the official scholarship portal using the button below.
              </li>
              <li>Sign in or register on that portal if required.</li>
              <li>
                Find the specific scholarship scheme and read its current rules.
              </li>
              <li>
                Complete and submit the application on the official website.
              </li>
              <li>
                Return to ScholarMate and update your personal application
                tracker.
              </li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Official Portal Action */}
      <Card className="p-5 sm:p-6" hover={false}>
        {officialApplyUrl ? (
          <>
            <h2 className="text-base font-bold text-slate-900">
              Apply on the Official Website
            </h2>

            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              You will open{" "}
              <span className="font-semibold text-slate-700">
                {scholarship.applicationPortal || scholarship.provider}
              </span>{" "}
              in a new browser tab.
            </p>

            <a
              href={officialApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-3 text-sm font-bold hover:bg-blue-700 transition"
            >
              Continue to Official Portal
              <ExternalLink className="w-4 h-4" />
            </a>
          </>
        ) : (
          <>
            <h2 className="text-base font-bold text-slate-900">
              Official Application Link
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              An approved official application link is not available for this
              scholarship yet.
            </p>

            <button
              type="button"
              disabled
              className="w-full mt-5 px-5 py-3 rounded-xl bg-slate-100 text-slate-400 text-sm font-bold cursor-not-allowed"
            >
              Official Link Unavailable
            </button>
          </>
        )}

        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
          Important: ScholarMate does not submit the official form, save your
          government-portal login details, or receive an official submission
          receipt through this link. Opening the portal does not mean your
          application has been submitted.
        </p>
      </Card>

      {/* Return Navigation */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to={`/scholarships/${scholarship.id}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Scholarship Details
        </Link>

        <Link
          to="/applications"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition"
        >
          My Application Tracker
        </Link>
      </div>
    </div>
  );
}

export default ApplicationForm;
