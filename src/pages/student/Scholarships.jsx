import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  Calendar,
  Building2,
  SlidersHorizontal,
  ExternalLink,
  ArrowRight,
  IndianRupee,
  Bookmark,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";

import { getAllScholarships } from "../../services/scholarshipData";

import {
  addScholarshipToTracker,
  getStudentApplications,
} from "../../services/applicationService";

const ALLOWED_OFFICIAL_HOSTS = [
  "scholarships.gov.in",
  "mahadbt2.maharashtra.gov.in",
];

function getOfficialApplyUrl(scholarship) {
  const candidate =
    scholarship?.officialApplyUrl || scholarship?.officialDetailsUrl;

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

function hasSpecifiedValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== null && value !== undefined && value !== "";
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

function Scholarships() {
  const { user } = useAuth();

  const scholarships = getAllScholarships();

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    domicile: "",
    category: "",
    branch: "",
    income: "",
  });

  const [savedScholarshipIds, setSavedScholarshipIds] = useState(
    () => new Set(),
  );

  const [trackerMessages, setTrackerMessages] = useState({});

  // Load the student's saved tracker entries.
  useEffect(() => {
    if (!user?.email) {
      setSavedScholarshipIds(new Set());
      return;
    }

    const applications = getStudentApplications(user.email);

    setSavedScholarshipIds(
      new Set(
        applications
          .map((application) => application.scholarshipId)
          .filter(Boolean),
      ),
    );
  }, [user?.email]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setSearch("");

    setFilters({
      domicile: "",
      category: "",
      branch: "",
      income: "",
    });
  };

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
          text: "Scholarship saved to your personal tracker.",
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
              : "Unable to save this scholarship. Please try again.",
        },
      }));
    }
  };

  const activeFilterCount =
    (search.trim() ? 1 : 0) + Object.values(filters).filter(Boolean).length;

  const filteredScholarships = useMemo(() => {
    return scholarships.filter((scholarship) => {
      const searchText = search.trim().toLowerCase();

      const searchMatch =
        !searchText ||
        scholarship.name.toLowerCase().includes(searchText) ||
        scholarship.provider.toLowerCase().includes(searchText) ||
        scholarship.description.toLowerCase().includes(searchText);

      const criteria = scholarship.criteria || {};

      const domicileSpecified = hasSpecifiedValue(criteria.states);
      const categorySpecified = hasSpecifiedValue(criteria.categories);
      const branchSpecified = hasSpecifiedValue(criteria.branches);

      const incomeSpecified =
        criteria.maximumAnnualFamilyIncome !== null &&
        criteria.maximumAnnualFamilyIncome !== undefined;

      const domicileMatch =
        !filters.domicile ||
        (filters.domicile === "specified" && domicileSpecified) ||
        (filters.domicile === "unspecified" && !domicileSpecified);

      const categoryMatch =
        !filters.category ||
        (filters.category === "specified" && categorySpecified) ||
        (filters.category === "unspecified" && !categorySpecified);

      const branchMatch =
        !filters.branch ||
        (filters.branch === "specified" && branchSpecified) ||
        (filters.branch === "unspecified" && !branchSpecified);

      const incomeMatch =
        !filters.income ||
        (filters.income === "specified" && incomeSpecified) ||
        (filters.income === "unspecified" && !incomeSpecified);

      return (
        searchMatch &&
        domicileMatch &&
        categoryMatch &&
        branchMatch &&
        incomeMatch
      );
    });
  }, [scholarships, search, filters]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Scholarships
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Discover opportunities, review their requirements, and apply through
            the official scholarship portal.
          </p>
        </div>

        <Link
          to="/applications"
          className="inline-flex items-center justify-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition self-start"
        >
          <Bookmark className="w-4 h-4" />
          My Application Tracker
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="p-5 sm:p-6" hover={false}>
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />

            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Search & Filters
            </h2>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search scholarship name or provider..."
            className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {[
            { name: "domicile", label: "Domicile Criteria" },
            { name: "category", label: "Category Criteria" },
            { name: "branch", label: "Branch Criteria" },
            { name: "income", label: "Family Income Limit" },
          ].map((filter) => (
            <div key={filter.name}>
              <label
                htmlFor={filter.name}
                className="block font-semibold text-slate-600 mb-1.5"
              >
                {filter.label}
              </label>

              <select
                id={filter.name}
                name={filter.name}
                value={filters[filter.name]}
                onChange={handleFilterChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
              >
                <option value="">All Records</option>
                <option value="specified">Criteria provided</option>
                <option value="unspecified">Not specified</option>
              </select>
            </div>
          ))}
        </div>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs sm:text-sm text-slate-600">
          Showing{" "}
          <span className="font-bold text-slate-900">
            {filteredScholarships.length}
          </span>{" "}
          scholarship opportunities
        </p>
      </div>

      {/* Scholarship Cards */}
      {filteredScholarships.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredScholarships.map((scholarship) => {
            const criteria = scholarship.criteria || {};
            const officialUrl = getOfficialApplyUrl(scholarship);
            const isSaved = savedScholarshipIds.has(scholarship.id);
            const message = trackerMessages[scholarship.id];

            const scoreRequirement =
              criteria.minimumScore != null
                ? `${criteria.minimumScore} ${criteria.scoreType || ""}`.trim()
                : "Not specified";

            const branches = criteria.branches?.length
              ? criteria.branches.join(", ")
              : "Not specified";

            const states = criteria.states?.length
              ? criteria.states.join(", ")
              : "Not specified";

            return (
              <Card
                key={scholarship.id}
                className="p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200"
                hover
              >
                <div>
                  {/* Scholarship Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {scholarship.name}
                      </h2>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{scholarship.provider}</span>
                      </div>
                    </div>

                    <span className="shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      Scholarship
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                    {scholarship.description}
                  </p>

                  {/* Criteria Summary */}
                  <div className="flex flex-wrap gap-2 mt-4 text-[11px]">
                    <span className="bg-slate-50 text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-lg font-semibold">
                      Score: {scoreRequirement}
                    </span>

                    <span className="bg-slate-50 text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-lg font-semibold">
                      Income limit:{" "}
                      {criteria.maximumAnnualFamilyIncome != null
                        ? formatAmount(criteria.maximumAnnualFamilyIncome)
                        : "Not specified"}
                    </span>

                    <span className="bg-slate-50 text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-lg font-semibold">
                      Branch: {branches}
                    </span>

                    <span className="bg-slate-50 text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-lg font-semibold">
                      Domicile: {states}
                    </span>
                  </div>

                  {/* Benefit and Deadline */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5" />
                        Scholarship Benefit
                      </span>

                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {formatAmount(scholarship.benefitAmount)}
                      </p>

                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {scholarship.benefitPeriod || "Period not specified"}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Application Deadline
                      </span>

                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {scholarship.deadline || "To be announced"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 mt-5 pt-4 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <Link
                      to={`/scholarships/${scholarship.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 text-center py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition"
                    >
                      View Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {officialUrl ? (
                      <a
                        href={officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 text-center py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Apply on Official Website
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="flex-1 inline-flex items-center justify-center gap-2 text-center py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 cursor-not-allowed"
                      >
                        Official Link Unavailable
                      </button>
                    )}
                  </div>

                  {/* Personal Tracker Action */}
                  {isSaved ? (
                    <Link
                      to="/applications"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Saved — View My Tracker
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSaveToTracker(scholarship)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 transition"
                    >
                      <Bookmark className="w-4 h-4" />
                      Save to My Tracker
                    </button>
                  )}

                  {message && (
                    <p
                      role={message.type === "error" ? "alert" : "status"}
                      className={`text-xs flex items-start gap-1.5 ${
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

                  {officialUrl && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      The official portal opens in a new tab. Track your
                      application status here manually.
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No scholarships found"
          message="No scholarships match your current search and filters. Try changing your filters or clearing them."
          buttonText="Reset All Filters"
          onButtonClick={clearFilters}
        />
      )}
    </div>
  );
}

export default Scholarships;
