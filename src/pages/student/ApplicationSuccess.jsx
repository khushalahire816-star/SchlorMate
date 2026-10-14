import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookmarkCheck,
  ExternalLink,
  FileText,
  ArrowRight,
  GraduationCap,
  Calendar,
  Building2,
  CircleAlert,
  CheckCircle2,
  Clock,
} from "lucide-react";

import Card from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";

import { getApplicationById } from "../../services/applicationService";

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

function formatDate(value) {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not recorded";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ApplicationSuccess() {
  const location = useLocation();
  const { user } = useAuth();

  const incomingApplicationId =
    location.state?.applicationId || location.state?.id || "";

  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (!user?.email || !incomingApplicationId) {
      setApplication(null);
      return;
    }

    try {
      const savedApplication = getApplicationById(
        incomingApplicationId,
        user.email,
      );

      setApplication(savedApplication);
    } catch {
      setApplication(null);
    }
  }, [incomingApplicationId, user?.email]);

  const scholarship = getScholarshipById(
    application?.scholarshipId || location.state?.scholarshipId,
  );

  const officialApplyUrl = getOfficialApplyUrl(scholarship);

  const hasLegacyStatus = application?.status === "Submitted";

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4 animate-fadeIn">
      <Card
        className="p-6 sm:p-10 max-w-2xl w-full text-center shadow-md border-slate-200"
        hover={false}
      >
        {/* Header Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-5">
          {application ? (
            <BookmarkCheck className="w-9 h-9 sm:w-11 sm:h-11" />
          ) : (
            <GraduationCap className="w-9 h-9 sm:w-11 sm:h-11" />
          )}
        </div>

        {/* Heading */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
          {application ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <CircleAlert className="w-3.5 h-3.5" />
          )}

          {application
            ? "ScholarMate Tracker"
            : "Official Application Reminder"}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {application
            ? "Your Tracker Record"
            : "Apply Through the Official Portal"}
        </h1>

        <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
          {application
            ? "The record below is stored in your personal ScholarMate tracker. It is separate from the scholarship provider's official application system."
            : "ScholarMate helps you discover scholarships and track your progress. To submit a government scholarship application, use the relevant official scholarship portal."}
        </p>

        {/* Tracker Record */}
        {application ? (
          <Card
            className="mt-8 bg-slate-50/70 border-slate-200 rounded-2xl p-5 sm:p-6 text-left shadow-none"
            hover={false}
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Personal Tracker Record
              </h2>

              <span className="text-xs font-semibold text-blue-700 flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5" />
                Saved Locally
              </span>
            </div>

            <div className="space-y-4 mt-4 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-slate-500 font-medium">Tracker ID</span>

                <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 w-fit break-all">
                  {application.applicationId || application.id}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-slate-500 font-medium">Scholarship</span>

                <span className="font-bold text-slate-900">
                  {application.scholarshipName || "Scholarship"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-slate-500 font-medium">Provider</span>

                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {application.provider ||
                    scholarship?.provider ||
                    "Not specified"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-slate-500 font-medium">
                  Personal Status
                </span>

                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold w-fit">
                  {hasLegacyStatus
                    ? "Needs Status Review"
                    : application.status || "Saved"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-slate-500 font-medium">
                  Added to Tracker
                </span>

                <span className="font-semibold text-slate-700">
                  {formatDate(application.createdAt)}
                </span>
              </div>
            </div>
          </Card>
        ) : (
          <div className="mt-8 text-left bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <CircleAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />

              <div>
                <h2 className="text-sm font-bold text-amber-900">
                  No tracker record was found
                </h2>

                <p className="text-xs text-amber-800 mt-2 leading-relaxed">
                  This page cannot confirm an official application submission.
                  Open My Applications to review your saved tracker records, or
                  browse scholarships to select an opportunity.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Official Submission Reminder */}
        <div className="mt-6 text-left bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-blue-600" />
            Complete Your Official Application
          </h2>

          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            To apply for a scholarship, open its official portal, sign in or
            register as required, complete the scheme's application form, and
            submit it on that website. Opening the portal alone does not mean
            that you applied.
          </p>

          {officialApplyUrl && (
            <a
              href={officialApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-2.5 text-sm font-bold hover:bg-blue-700 transition"
            >
              Open Official Scholarship Portal
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Important Notice */}
        <div className="mt-5 flex items-start gap-2 text-left text-xs text-slate-500 leading-relaxed">
          <Clock className="w-4 h-4 shrink-0 mt-0.5" />

          <p>
            ScholarMate does not receive official application receipts,
            verification updates, or scholarship decisions through this page.
            Update your personal tracker manually after completing the relevant
            steps on the official portal.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
          <Link
            to="/applications"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-3 text-sm font-bold hover:bg-blue-700 transition"
          >
            <FileText className="w-4 h-4" />
            Open My Tracker
          </Link>

          <Link
            to="/scholarships"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 text-slate-700 px-5 py-3 text-sm font-bold hover:bg-slate-50 transition"
          >
            <Calendar className="w-4 h-4" />
            Explore Scholarships
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default ApplicationSuccess;
