import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  ExternalLink,
  Trash2,
  Calendar,
  IndianRupee,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Search,
  RefreshCw,
} from "lucide-react";

import Card from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";

import { getAllScholarships } from "../../services/scholarshipData";

import {
  getStudentApplications,
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

function getStatusDescription(status) {
  switch (status) {
    case "Saved":
      return "Saved to your personal list.";

    case "In Progress":
      return "You are preparing or working on this application.";

    case "Applied":
      return "You have marked this scholarship as applied.";

    case "Approved":
      return "You have recorded an approval.";

    case "Rejected":
      return "You have recorded a rejection.";

    default:
      return "Review this older prototype record and update its status.";
  }
}

function Applications() {
  const { user } = useAuth();

  const scholarships = getAllScholarships();

  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);
  const [busyId, setBusyId] = useState("");
  const [loadError, setLoadError] = useState("");

  const loadApplications = () => {
    if (!user?.email) {
      setApplications([]);
      return;
    }

    setLoadError("");

    try {
      setApplications(getStudentApplications(user.email));
    } catch {
      setLoadError(
        "Unable to load your tracker. Please refresh the page and try again.",
      );
    }
  };

  useEffect(() => {
    loadApplications();
  }, [user?.email]);

  const getScholarship = (application) => {
    return (
      scholarships.find(
        (scholarship) => scholarship.id === application.scholarshipId,
      ) || null
    );
  };

  const filteredApplications = applications.filter((application) => {
    const scholarshipName = application.scholarshipName || "Scholarship";

    const provider = application.provider || "";

    const searchText = search.trim().toLowerCase();

    const searchMatch =
      !searchText ||
      scholarshipName.toLowerCase().includes(searchText) ||
      provider.toLowerCase().includes(searchText);

    // Older prototype submissions should be reviewed separately.
    const currentStatus =
      application.status === "Submitted"
        ? "Legacy"
        : application.status || "Saved";

    const statusMatch =
      filterStatus === "All" ||
      (filterStatus === "Legacy" && currentStatus === "Legacy") ||
      currentStatus === filterStatus;

    return searchMatch && statusMatch;
  });

  const counts = {
    total: applications.length,
    saved: applications.filter((application) => application.status === "Saved")
      .length,
    inProgress: applications.filter(
      (application) => application.status === "In Progress",
    ).length,
    applied: applications.filter(
      (application) => application.status === "Applied",
    ).length,
    completed: applications.filter((application) =>
      ["Approved", "Rejected"].includes(application.status),
    ).length,
    legacy: applications.filter(
      (application) => application.status === "Submitted",
    ).length,
  };

  const handleStatusChange = (application, newStatus) => {
    if (!user?.email || busyId) return;

    setBusyId(application.id);
    setMessage(null);

    try {
      updateApplicationStatus(application.id, newStatus, user.email);

      loadApplications();

      setMessage({
        type: "success",
        text: "Your tracker status has been updated.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to update the tracker status.",
      });
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = (application) => {
    if (!user?.email || busyId) return;

    const confirmed = window.confirm(
      `Remove "${application.scholarshipName || "this scholarship"}" from your personal tracker?`,
    );

    if (!confirmed) return;

    setBusyId(application.id);
    setMessage(null);

    try {
      const deleted = deleteApplication(application.id, user.email);

      if (!deleted) {
        throw new Error("The tracker entry could not be found.");
      }

      loadApplications();

      setMessage({
        type: "success",
        text: "The scholarship was removed from your personal tracker.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to remove the scholarship.",
      });
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            Personal Scholarship Tracker
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Applications
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Keep track of scholarships you have saved and update your progress
            as you apply through their official portals.
          </p>
        </div>

        <Link
          to="/scholarships"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2.5 text-xs font-bold hover:bg-blue-700 transition self-start"
        >
          <Search className="w-4 h-4" />
          Explore Scholarships
        </Link>
      </div>

      {/* Tracker Explanation */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
        <GraduationCap className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />

        <div>
          <p className="text-sm font-bold text-blue-900">
            Manage your scholarship journey
          </p>

          <p className="text-xs text-blue-800 mt-1 leading-relaxed">
            Applications are completed on the official scholarship portals.
            Here, you can save opportunities and manually record your progress.
            Status changes are your own entries and are not automatically
            confirmed by a government portal.
          </p>
        </div>
      </div>

      {/* Feedback Message */}
      {message && (
        <div
          role={message.type === "error" ? "alert" : "status"}
          className={`flex items-start gap-2 p-4 rounded-xl border text-sm ${
            message.type === "error"
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
          }`}
        >
          {message.type === "error" ? (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          )}

          <span>{message.text}</span>
        </div>
      )}

      {loadError && (
        <div
          role="alert"
          className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {loadError}

          <button
            type="button"
            onClick={loadApplications}
            className="ml-auto font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          {
            label: "Total Saved",
            value: counts.total,
            icon: Bookmark,
            color: "text-blue-600",
          },
          {
            label: "In Progress",
            value: counts.inProgress,
            icon: Clock,
            color: "text-amber-600",
          },
          {
            label: "Marked Applied",
            value: counts.applied,
            icon: FileText,
            color: "text-violet-600",
          },
          {
            label: "Final Status Recorded",
            value: counts.completed,
            icon: CheckCircle2,
            color: "text-emerald-600",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label} className="p-4 sm:p-5" hover>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </p>

                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>

              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                {item.value}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Legacy Records */}
      {counts.legacy > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <p className="font-bold">
            {counts.legacy} older prototype record(s) need review
          </p>

          <p className="mt-1 leading-relaxed">
            These records were created before the external-portal workflow.
            Their old “Submitted” status is not official confirmation. Review
            them and manually select the status that reflects your actual
            progress.
          </p>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="p-4 sm:p-5" hover={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="trackerSearch"
              className="block text-xs font-bold text-slate-600 mb-1.5"
            >
              Search Scholarships
            </label>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                id="trackerSearch"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by scholarship or provider..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="trackerStatus"
              className="block text-xs font-bold text-slate-600 mb-1.5"
            >
              Filter by Status
            </label>

            <select
              id="trackerStatus"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
              <option value="Legacy">Older Prototype Records</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tracker Entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Your Scholarship List
          </h2>

          <button
            type="button"
            onClick={loadApplications}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {filteredApplications.length === 0 ? (
          <Card className="p-8 sm:p-10 text-center" hover={false}>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
              <Bookmark className="w-7 h-7 text-blue-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-4">
              {applications.length === 0
                ? "Your tracker is empty"
                : "No matching scholarships"}
            </h3>

            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              {applications.length === 0
                ? "Explore scholarships and use Save to My Tracker to build your personal list. You can update progress here later."
                : "Try another search term or change the selected status filter."}
            </p>

            <Link
              to="/scholarships"
              className="inline-flex items-center justify-center gap-2 mt-5 rounded-xl bg-blue-600 text-white px-5 py-2.5 text-sm font-bold hover:bg-blue-700 transition"
            >
              Browse Scholarships
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>
        ) : (
          filteredApplications.map((application) => {
            const scholarship = getScholarship(application);

            const officialUrl = getOfficialApplyUrl(scholarship);

            const status =
              application.status === "Submitted"
                ? "Submitted"
                : APPLICATION_STATUSES.includes(application.status)
                  ? application.status
                  : "Saved";

            const isLegacy = status === "Submitted";

            const scholarshipId = application.scholarshipId || scholarship?.id;

            return (
              <Card key={application.id} className="p-5 sm:p-6" hover>
                {/* Entry Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {application.scholarshipName || "Scholarship"}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        {application.provider ||
                          scholarship?.provider ||
                          "Scholarship Provider"}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-2">
                        Added: {formatDate(application.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col lg:items-end gap-2">
                    <span
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${getStatusStyle(status === "Submitted" ? "Saved" : status)}`}
                    >
                      {status === "Submitted" ? (
                        <AlertCircle className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}

                      {isLegacy ? "Older Prototype Record" : status}
                    </span>

                    <p className="text-[11px] text-slate-500 lg:text-right">
                      {getStatusDescription(status)}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <IndianRupee className="w-4 h-4" />
                      Listed Benefit
                    </div>

                    <p className="text-sm font-bold text-slate-900 mt-2">
                      {formatAmount(scholarship?.benefitAmount)}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1">
                      {scholarship?.benefitPeriod ||
                        "Benefit period not specified"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-4 h-4" />
                      Listed Deadline
                    </div>

                    <p className="text-sm font-bold text-slate-900 mt-2">
                      {scholarship?.deadline || "Not specified"}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1">
                      Last updated:{" "}
                      {formatDate(
                        application.statusUpdatedAt || application.updatedAt,
                      )}
                    </p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="mt-5 p-4 rounded-xl border border-slate-200 bg-white">
                  <label
                    htmlFor={`status-${application.id}`}
                    className="block text-xs font-bold text-slate-700 mb-2"
                  >
                    Update Your Personal Status
                  </label>

                  <select
                    id={`status-${application.id}`}
                    value={status === "Submitted" ? "Saved" : status}
                    disabled={busyId === application.id}
                    onChange={(event) =>
                      handleStatusChange(application, event.target.value)
                    }
                    className="w-full sm:max-w-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-60"
                  >
                    {APPLICATION_STATUSES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Choose Applied only after you submit the application on the
                    official portal. Choose Approved or Rejected only when you
                    have received that outcome.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 mt-5 pt-4 border-t border-slate-100">
                  {/* Open the personal tracker record */}
                  <Link
                    to={`/applications/${application.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    <FileText className="w-4 h-4" />
                    View Tracker Details
                  </Link>

                  {/* Open the scholarship information page */}
                  {scholarshipId && (
                    <Link
                      to={`/scholarships/${scholarshipId}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                    >
                      Scholarship Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {/* Open the official application portal */}
                  {officialUrl ? (
                    <a
                      href={officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border border-blue-200 text-blue-700 hover:bg-blue-50 transition"
                    >
                      Open Official Portal
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="flex-1 inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-50 text-slate-400 border border-slate-200">
                      Official link unavailable
                    </span>
                  )}

                  {/* Remove from personal tracker */}
                  <button
                    type="button"
                    disabled={busyId === application.id}
                    onClick={() => handleDelete(application)}
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border border-rose-200 text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>

                {isLegacy && (
                  <p className="text-xs text-amber-700 mt-4 leading-relaxed">
                    This entry was created by the older prototype workflow. Its
                    old submission status is not treated as official
                    confirmation. Update the status above to reflect your actual
                    progress.
                  </p>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Footer Note */}
      <div className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

        <p>
          Tracker information is saved in this browser. ScholarMate does not
          receive automatic updates from the government portal, and it cannot
          independently verify the official application or decision status.
        </p>
      </div>
    </div>
  );
}

export default Applications;
