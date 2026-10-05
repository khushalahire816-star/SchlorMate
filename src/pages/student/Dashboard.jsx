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
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import BarChart from "../../components/charts/BarChart";
import PieChart from "../../components/charts/PieChart";
import DonutChart from "../../components/charts/DonutChart";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const studentName = user?.name || "Student";

  const scholarships = [
    {
      id: 1,
      name: "AICTE Pragati Scholarship",
      provider: "AICTE",
      match: 96,
      amount: "₹50,000 / year",
      deadline: "30 Sep 2026",
      category: "Engineering",
      daysLeft: 22,
    },
    {
      id: 2,
      name: "National Scholarship",
      provider: "Government of India",
      match: 91,
      amount: "₹30,000 / year",
      deadline: "15 Oct 2026",
      category: "General",
      daysLeft: 37,
    },
    {
      id: 3,
      name: "Maharashtra State Scholarship",
      provider: "Government of Maharashtra",
      match: 87,
      amount: "₹25,000 / year",
      deadline: "31 Oct 2026",
      category: "State",
      daysLeft: 53,
    },
  ];

  // Real data for Dashboard Visualizations
  const categoryBarData = [
    { label: "Engineering", shortLabel: "Eng.", value: 3, color: "#2563eb", subtext: "3 scholarships" },
    { label: "Merit-Based", shortLabel: "Merit", value: 2, color: "#0d9488", subtext: "2 scholarships" },
    { label: "State Govt", shortLabel: "State", value: 2, color: "#6366f1", subtext: "2 scholarships" },
    { label: "General", shortLabel: "General", value: 1, color: "#f59e0b", subtext: "1 scholarship" },
    { label: "Category", shortLabel: "Category", value: 1, color: "#ec4899", subtext: "1 scholarship" },
  ];

  const applicationPieData = [
    { label: "Submitted", value: 2, color: "#2563eb" },
    { label: "Under Review", value: 1, color: "#f59e0b" },
    { label: "Approved", value: 1, color: "#10b981" },
    { label: "Rejected", value: 1, color: "#f43f5e" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-blue-200 border border-white/10 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI Scholarship Recommendations Active
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {studentName} 👋
          </h1>

          <p className="text-blue-100 text-sm sm:text-base mt-2 leading-relaxed">
            Here's an overview of your scholarship opportunities, matched eligibility criteria, and active application statuses.
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
        {/* Recommended */}
        <Card className="p-5 sm:p-6" hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Recommended
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                12
              </h2>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+2 new matches this week</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/80 shadow-xs shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Applied */}
        <Card className="p-5 sm:p-6" hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Applied
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                5
              </h2>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1 Approved, 1 in Review</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/80 shadow-xs shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Profile Completion */}
        <Card className="p-5 sm:p-6" hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Profile Completion
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                85%
              </h2>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-600">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>2 fields missing</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/80 shadow-xs shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Success Chance */}
        <Card className="p-5 sm:p-6" hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Success Chance
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                85%
              </h2>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-purple-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>High Selection Tier</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/80 shadow-xs shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Data Visualizations (Bar Chart & Pie Chart & Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Completion Donut Chart */}
        <Card className="p-6 flex flex-col justify-between" hover>
          <div>
            <DonutChart
              value={85}
              title="Profile Readiness"
              subtitle="Completion metric based on verified credentials"
              centerLabel="Profile Score"
              centerValue="85%"
              size={180}
              strokeWidth={16}
              primaryColor="#2563eb"
            />

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Academic CGPA
                </span>
                <span className="font-semibold text-slate-900">Verified</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Income Certificate
                </span>
                <span className="font-semibold text-slate-900">Verified</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Technical Projects
                </span>
                <span className="font-semibold text-amber-600">Pending</span>
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

        {/* Scholarships by Category Bar Chart */}
        <Card className="p-6 lg:col-span-2 flex flex-col justify-between" hover>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Scholarships by Category
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison of available scholarship opportunities by educational category
                </p>
              </div>

              <Link
                to="/scholarships"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                All Categories <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="pt-2">
              <BarChart
                data={categoryBarData}
                height={210}
                valueSuffix=" scholarships"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>Highest availability: <strong>Engineering</strong> (3 awards)</span>
            <span className="text-emerald-600 font-semibold">100% Verified Providers</span>
          </div>
        </Card>
      </div>

      {/* 4. Application Status Pie Chart & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                AI Recommended Scholarships
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Top matched opportunities tailored to your academic background.
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
            {scholarships.map((scholarship) => (
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

                  <div className="shrink-0 flex items-center sm:flex-col sm:items-end gap-2">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-700 px-3 py-1 rounded-full text-xs font-extrabold">
                      <Sparkles className="w-3.5 h-3.5" />
                      {scholarship.match}% AI Match
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <Award className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Award Amount</p>
                      <p className="font-bold text-slate-800">{scholarship.amount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Application Deadline</p>
                      <p className="font-bold text-slate-800">{scholarship.deadline}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-2">
                  <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Closes in {scholarship.daysLeft} days
                  </span>

                  <Link
                    to={`/scholarships/${scholarship.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                  >
                    View Scholarship Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Application Status Pie Chart & Upcoming Deadlines */}
        <div className="space-y-6">
          {/* Application Status Pie Chart */}
          <Card className="p-6" hover>
            <PieChart
              data={applicationPieData}
              title="Application Status"
              subtitle="Distribution across submitted applications"
              size={170}
            />

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Applications: <strong>5</strong></span>
              <Link
                to="/applications"
                className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Track All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="p-6" hover>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Upcoming Deadlines
                </h3>
                <p className="text-xs text-slate-500">Don't miss application windows</p>
              </div>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    AICTE Pragati Scholarship
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">30 Sep 2026</p>
                </div>
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full shrink-0">
                  22 days left
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    National Scholarship
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">15 Oct 2026</p>
                </div>
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full shrink-0">
                  37 days left
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Maharashtra Scholarship
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">31 Oct 2026</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full shrink-0">
                  53 days left
                </span>
              </div>
            </div>

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
    </div>
  );
}

export default Dashboard;
