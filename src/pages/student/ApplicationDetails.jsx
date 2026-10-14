import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  ExternalLink,
  Award,
  AlertCircle,
  IndianRupee,
  Trash2,
  Bookmark,
  RefreshCw,
} from "lucide-react";

import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";

import { getAllScholarships } from "../../services/scholarshipData";

import {
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  APPLICATION_STATUSES,
} from "../../services/applicationService";

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

function getStatusStyle(status) {
  switch (status) {
    case "Saved":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "In Progress":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Applied":
      return "bg-violet-50 text-violet-700 border-violet-200";

    case "Approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Rejected":
      return "bg-rose-50 text-rose-700 border-rose-200";

    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const scholarshipRecords = getAllScholarships();

  useEffect(() => {
    setLoading(true);
    setLoadError("");

    if (!user?.email) {
      setApplication(null);
      setLoadError("Please log in to view your personal tracker.");
      setLoading(false);
      return;
    }

    try {
      const savedApplication = getApplicationById(id, user.email);

      if (!savedApplication) {
        setApplication(null);
        setLoadError(
          "This tracker record could not be found. It may have been removed or may belong to another account.",
        );
      } else {
        setApplication(savedApplication);
      }
    } catch {
      setApplication(null);
      setLoadError(
        "Unable to load this tracker record. Please return to your tracker and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [id, user?.email]);

  const scholarship = scholarshipRecords.find(
    (record) => record.id === application?.scholarshipId,
  );

  const officialApplyUrl = getOfficialApplyUrl(scholarship);

  const currentStatus = APPLICATION_STATUSES.includes(application?.status)
    ? application.status
    : "Saved";

  const isLegacyRecord = application?.status === "Submitted";

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;

    if (!user?.email || !application || busy) return;

    setBusy(true);
    setActionError("");
    setActionSuccess("");

    try {
      const updatedApplication = updateApplicationStatus(
        application.id,
        newStatus,
        user.email,
      );

      setApplication(updatedApplication);
      setActionSuccess("Your personal tracker status was updated.");
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to update your status.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = () => {
    if (!user?.email || !application || busy) return;

    const confirmed = window.confirm(
      `Remove "${application.scholarshipName}" from your tracker?`,
    );

    if (!confirmed) return;

    setBusy(true);
    setActionError("");

    try {
      const deleted = deleteApplication(application.id, user.email);

      if (!deleted) {
        throw new Error("The tracker record could not be removed.");
      }

      navigate("/applications", {
        replace: true,
        state: {
          message: "Scholarship removed from your personal tracker.",
        },
      });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to remove the tracker record.",
      );

      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center" hover={false}>
        <RefreshCw className="w-6 h-6 text-blue-600 mx-auto animate-spin" />

        <p className="text-sm text-slate-500 mt-3">
          Loading your tracker record...
        </p>
      </Card>
    );
  }

  if (!application) {
    return (
      <div className="space-y-5 animate-fadeIn">
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Applications
        </Link>

        <Card className="p-8 text-center" hover={false}>
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />

          <h1 className="text-xl font-bold text-slate-900">
            Tracker Record Not Found
          </h1>

          <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
            {loadError ||
              "This scholarship record is unavailable in your personal tracker."}
          </p>

          <Link
            to="/applications"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"
          >
            Open My Tracker
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Navigation */}
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/applications")}
          icon={ArrowLeft}
        >
          Back to Applications
        </Button>
      </div>

      {/* Header */}
      <Card className="p-6 sm:p-8" hover={false}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <Bookmark className="w-4 h-4" />
              Personal Tracker Record
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {application.scholarshipName || "Scholarship"}
            </h1>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Building2 className="w-3.5 h-3.5" />

              <span>
                {application.provider ||
                  scholarship?.provider ||
                  "Scholarship Provider"}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Tracker ID:{" "}
              <span className="font-mono font-semibold text-slate-700">
                {application.applicationId || application.id}
              </span>
            </p>
          </div>

          <div className="shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold ${getStatusStyle(currentStatus)}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isLegacyRecord ? "Needs Status Review" : currentStatus}
            </span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Listed Benefit
            </span>

            <p className="text-sm font-bold text-slate-900 mt-1">
              {formatAmount(scholarship?.benefitAmount)}
            </p>

            <p className="text-[11px] text-slate-500 mt-1">
              {scholarship?.benefitPeriod || "Period not specified"}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Listed Deadline
            </span>

            <p className="text-sm font-bold text-slate-900 mt-1">
              {scholarship?.deadline || "Not specified"}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Added to Tracker
            </span>

            <p className="text-sm font-bold text-slate-900 mt-1">
              {formatDate(application.createdAt)}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Last Status Update
            </span>

            <p className="text-sm font-bold text-slate-900 mt-1">
              {formatDate(application.statusUpdatedAt || application.updatedAt)}
            </p>
          </div>
        </div>
      </Card>

      {/* Legacy Record Notice */}
      {isLegacyRecord && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
          <p className="font-bold">Review this older tracker record</p>

          <p className="text-xs mt-1 leading-relaxed">
            This entry was created by the previous prototype workflow. Its
            previous “Submitted” status does not confirm that an official
            application was submitted. Select the status that accurately
            reflects your progress below.
          </p>
        </div>
      )}

      {/* Feedback */}
      {actionSuccess && (
        <div
          role="status"
          className="flex items-start gap-2 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          {actionSuccess}
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="flex items-start gap-2 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {actionError}
        </div>
      )}

      {/* Status Management */}
      <Card className="p-6 sm:p-8" hover={false}>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />

          <h2 className="text-base font-bold text-slate-900">
            Manage Application Progress
          </h2>
        </div>

        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          Update this status manually after reviewing your progress on the
          relevant official scholarship portal.
        </p>

        <label
          htmlFor="applicationStatus"
          className="block text-xs font-bold text-slate-700 mb-2"
        >
          Current Personal Status
        </label>

        <select
          id="applicationStatus"
          value={currentStatus}
          onChange={handleStatusChange}
          disabled={busy}
          className="w-full sm:max-w-sm bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-60"
        >
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          Choose Applied only after you submit the official form. Choose
          Approved or Rejected only when you have received that decision from
          the provider.
        </p>

        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-sm font-semibold text-slate-800">
            {currentStatus}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {currentStatus === "Saved"
              ? "This scholarship is in your saved list."
              : currentStatus === "In Progress"
                ? "You are preparing or working on this application."
                : currentStatus === "Applied"
                  ? "You have manually recorded that you submitted the application."
                  : currentStatus === "Approved"
                    ? "You have manually recorded an approval."
                    : "You have manually recorded a rejection."}
          </p>
        </div>
      </Card>

      {/* Documents */}
      <Card className="p-6" hover={false}>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-purple-600" />

          <h2 className="text-base font-bold text-slate-900">
            Personal Document Checklist
          </h2>
        </div>

        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          These are the document notes saved in your ScholarMate tracker. They
          do not show whether the official portal has received or verified any
          document.
        </p>

        {Array.isArray(application.documents) &&
        application.documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {application.documents.map((document, index) => {
              const documentName =
                typeof document === "string"
                  ? document
                  : document.name || "Document";

              return (
                <div
                  key={`${documentName}-${index}`}
                  className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 flex items-center gap-2.5"
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />

                  <span className="text-xs font-semibold text-slate-800">
                    {documentName}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
            <p className="font-semibold">No document notes added</p>

            <p className="text-xs mt-1 leading-relaxed">
              Review the official scholarship's document requirements and keep
              the required files ready for the application.
            </p>
          </div>
        )}
      </Card>

      {/* Official Portal */}
      <Card className="p-6" hover={false}>
        <div className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-blue-600" />

          <h2 className="text-base font-bold text-slate-900">
            Official Scholarship Portal
          </h2>
        </div>

        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Continue to the scholarship provider's website to review requirements,
          submit an application, or check its status.
        </p>

        {officialApplyUrl ? (
          <a
            href={officialApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 mt-4 rounded-xl bg-blue-600 text-white px-5 py-2.5 text-sm font-bold hover:bg-blue-700 transition"
          >
            Open Official Website
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <p className="text-xs text-slate-500 mt-4">
            An official link is not available for this scholarship.
          </p>
        )}
      </Card>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/applications"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Tracker
        </Link>

        <button
          type="button"
          disabled={busy}
          onClick={handleRemove}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          Remove from Tracker
        </button>
      </div>

      <p className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
        <IndianRupee className="w-4 h-4 shrink-0 mt-0.5" />

        <span>
          Tracker amounts and deadlines come from ScholarMate's current
          scholarship data. They may be sample values. Your tracker status is
          maintained locally and is not an official application receipt or
          decision from the scholarship provider.
        </span>
      </p>
    </div>
  );
}

export default ApplicationDetails;
