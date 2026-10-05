import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  X,
  GraduationCap,
  Sparkles,
  Calendar,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Building2,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

function Scholarships() {
  const navigate = useNavigate();
  const loading = false;
  const error = false;

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    state: "",
    category: "",
    branch: "",
    income: "",
    minMatch: "",
  });

  const scholarships = [
    {
      id: 1,
      name: "AICTE Pragati Scholarship",
      provider: "AICTE",
      amount: "₹50,000 / year",
      deadline: "30 Sep 2026",
      category: "Engineering",
      state: "All India",
      branch: "Engineering",
      income: 800000,
      match: 96,
      cgpa: "7.5+",
      description:
        "Financial support for eligible students pursuing technical education across accredited Indian colleges.",
    },
    {
      id: 2,
      name: "National Scholarship",
      provider: "Government of India",
      amount: "₹30,000 / year",
      deadline: "15 Oct 2026",
      category: "General",
      state: "All India",
      branch: "All",
      income: 600000,
      match: 91,
      cgpa: "6.5+",
      description:
        "Comprehensive scholarship support for undergraduate students pursuing accredited degree programs.",
    },
    {
      id: 3,
      name: "Maharashtra State Scholarship",
      provider: "Government of Maharashtra",
      amount: "₹25,000 / year",
      deadline: "31 Oct 2026",
      category: "State",
      state: "Maharashtra",
      branch: "All",
      income: 500000,
      match: 87,
      cgpa: "6.0+",
      description:
        "Financial assistance for eligible students domicile and studying in higher education institutions in Maharashtra.",
    },
    {
      id: 4,
      name: "Reliance Foundation Scholarship",
      provider: "Reliance Foundation",
      amount: "₹2,00,000",
      deadline: "15 Nov 2026",
      category: "Merit",
      state: "All India",
      branch: "Engineering",
      income: 1000000,
      match: 84,
      cgpa: "8.0+",
      description:
        "Merit-based scholarship opportunity empowering first-generation college students and engineering innovators.",
    },
    {
      id: 5,
      name: "Tata Scholarship",
      provider: "Tata Trusts",
      amount: "₹50,000",
      deadline: "30 Nov 2026",
      category: "Merit",
      state: "All India",
      branch: "Engineering",
      income: 700000,
      match: 81,
      cgpa: "7.0+",
      description:
        "Prestigious financial assistance for deserving students meeting academic excellence and need criteria.",
    },
    {
      id: 6,
      name: "Post Matric Scholarship",
      provider: "Government Scholarship",
      amount: "₹20,000",
      deadline: "15 Dec 2026",
      category: "Category Based",
      state: "Maharashtra",
      branch: "All",
      income: 400000,
      match: 78,
      cgpa: "5.5+",
      description:
        "Social justice and financial support for eligible students pursuing post-matriculation courses.",
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setFilters({
      state: "",
      category: "",
      branch: "",
      income: "",
      minMatch: "",
    });
  };

  const activeFilterCount =
    (search ? 1 : 0) +
    Object.values(filters).filter((val) => val !== "").length;

  const filteredScholarships = scholarships.filter((scholarship) => {
    const searchMatch =
      scholarship.name.toLowerCase().includes(search.toLowerCase()) ||
      scholarship.provider.toLowerCase().includes(search.toLowerCase());

    const stateMatch =
      filters.state === "" || scholarship.state === filters.state;

    const categoryMatch =
      filters.category === "" || scholarship.category === filters.category;

    const branchMatch =
      filters.branch === "" ||
      scholarship.branch === filters.branch ||
      scholarship.branch === "All";

    const incomeMatch =
      filters.income === "" || scholarship.income <= Number(filters.income);

    const matchScore =
      filters.minMatch === "" || scholarship.match >= Number(filters.minMatch);

    return (
      searchMatch &&
      stateMatch &&
      categoryMatch &&
      branchMatch &&
      incomeMatch &&
      matchScore
    );
  });

  if (loading) {
    return <Loading message="Loading scholarships..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to Load Scholarships"
        message="We couldn't retrieve scholarship information. Please try again."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Scholarships
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Discover verified scholarships filtered according to your academic qualifications and financial eligibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            {filteredScholarships.length} of {scholarships.length} available
          </span>
        </div>
      </div>

      {/* Search and Filters Card */}
      <Card className="p-5 sm:p-6" hover={false}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Search & Filter Criteria
            </h2>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Reset Filters ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by scholarship title, provider (e.g. AICTE, Reliance, Tata)..."
            className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Selects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* State */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">
              Region / State
            </label>
            <select
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
            >
              <option value="">All States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="All India">All India</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Engineering">Engineering</option>
              <option value="General">General</option>
              <option value="State">State</option>
              <option value="Merit">Merit</option>
              <option value="Category Based">Category Based</option>
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">
              Academic Branch
            </label>
            <select
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
            >
              <option value="">All Branches</option>
              <option value="Engineering">Engineering</option>
              <option value="Computer Science">Computer Science</option>
              <option value="AIML">AIML</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>

          {/* Income */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">
              Max Family Income
            </label>
            <select
              name="income"
              value={filters.income}
              onChange={handleFilterChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
            >
              <option value="">Any Income</option>
              <option value="300000">Up to ₹3 Lakh</option>
              <option value="500000">Up to ₹5 Lakh</option>
              <option value="700000">Up to ₹7 Lakh</option>
              <option value="1000000">Up to ₹10 Lakh</option>
            </select>
          </div>

          {/* Minimum Match */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">
              Min. AI Match
            </label>
            <select
              name="minMatch"
              value={filters.minMatch}
              onChange={handleFilterChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
            >
              <option value="">Any Match</option>
              <option value="90">90%+ (Top Match)</option>
              <option value="80">80%+ (High Match)</option>
              <option value="70">70%+ (Eligible)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs sm:text-sm text-slate-600">
          Showing <span className="font-bold text-slate-900">{filteredScholarships.length}</span> scholarships matching criteria
        </p>
      </div>

      {/* Scholarship Cards Grid */}
      {filteredScholarships.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredScholarships.map((scholarship) => (
            <Card
              key={scholarship.id}
              className="p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200"
              hover
            >
              <div>
                {/* Top: Category & Match Badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {scholarship.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                        {scholarship.state}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 mt-2">
                      {scholarship.name}
                    </h2>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{scholarship.provider}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
                    </div>
                  </div>

                  <div className="shrink-0">
                    <div className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${
                      scholarship.match >= 90
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                        : "bg-blue-50 text-blue-700 border border-blue-200/80"
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      {scholarship.match}% Match
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                  {scholarship.description}
                </p>

                {/* Eligibility chips */}
                <div className="flex flex-wrap gap-2 mt-4 text-[11px]">
                  <span className="bg-slate-50 text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-lg font-semibold">
                    CGPA: {scholarship.cgpa}
                  </span>
                  <span className="bg-slate-50 text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-lg font-semibold">
                    Income: &lt; ₹{(scholarship.income / 100000).toFixed(0)}L
                  </span>
                  <span className="bg-slate-50 text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-lg font-semibold">
                    Branch: {scholarship.branch}
                  </span>
                </div>

                {/* Amount and Deadline Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-medium">Award Amount</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {scholarship.amount}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-medium">Application Deadline</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      {scholarship.deadline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2.5 mt-5 pt-4 border-t border-slate-100">
                <Link
                  to={`/scholarships/${scholarship.id}`}
                  className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition"
                >
                  View Details
                </Link>

                <Button
                  className="flex-1"
                  size="sm"
                  onClick={() => {
                    console.log(`Apply clicked for ${scholarship.name}`);
                    navigate(`/scholarships/${scholarship.id}/apply`);
                  }}
                  icon={ArrowRight}
                >
                  Apply Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredScholarships.length === 0 && (
        <EmptyState
          icon={Search}
          title="No scholarships found"
          message="We couldn't find any scholarships matching your active filter criteria. Try adjusting your search keyword or clearing selected filters."
          buttonText="Reset All Filters"
          onButtonClick={clearFilters}
        />
      )}
    </div>
  );
}

export default Scholarships;
