import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Target,
  Award,
  Calendar,
  ArrowRight,
  TrendingUp,
  Building2,
  ShieldCheck,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";

function Recommendations() {
  const navigate = useNavigate();
  const loading = false;

  const recommendations = [
    {
      id: 1,
      name: "AICTE Pragati Scholarship",
      provider: "AICTE",
      amount: "₹50,000 / year",
      deadline: "30 Sep 2026",
      match: 96,
      chance: 85,
      reasons: [
        "You are enrolled in an AICTE-approved Engineering degree",
        "Your academic CGPA aligns with merit scholarship cutoffs",
        "Your family annual income satisfies the prescribed eligibility limit",
        "Your demographic and state categories have high quota allocation",
      ],
    },
    {
      id: 2,
      name: "National Scholarship",
      provider: "Government of India",
      amount: "₹30,000 / year",
      deadline: "15 Oct 2026",
      match: 91,
      chance: 78,
      reasons: [
        "Your education level and college accreditation are fully compatible",
        "Your academic records indicate consistent performance",
        "You fulfill all prerequisite central sector eligibility criteria",
      ],
    },
    {
      id: 3,
      name: "Maharashtra State Scholarship",
      provider: "Government of Maharashtra",
      amount: "₹25,000 / year",
      deadline: "31 Oct 2026",
      match: 87,
      chance: 74,
      reasons: [
        "You are pursuing higher studies in the State of Maharashtra",
        "Your university holds state scholarship recognition",
        "Your family income falls comfortably within state thresholds",
      ],
    },
    {
      id: 4,
      name: "Reliance Foundation Scholarship",
      provider: "Reliance Foundation",
      amount: "₹2,00,000",
      deadline: "15 Nov 2026",
      match: 84,
      chance: 68,
      reasons: [
        "Undergraduate technical specialization aligns with foundation goals",
        "High academic aptitude demonstrates competitive eligibility",
        "Leadership and extracurricular activities reinforce candidate score",
      ],
    },
  ];

  if (loading) {
    return <Loading message="Generating AI recommendations..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Opportunity Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personalized Recommendations
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Scholarships ranked according to your academic qualifications, income eligibility, and target discipline.
          </p>
        </div>
      </div>

      {/* AI Explanation Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Lightbulb className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900">
              How the Recommendation Engine Calculates Your Matches
            </h2>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
              Our algorithms analyze official eligibility guidelines against your profile—evaluating CGPA, annual household income, academic degree, state domicile, and social category—to predict where your probability of scholarship award is highest.
            </p>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Opportunities Ranked
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-extrabold text-slate-900">
              {recommendations.length}
            </p>
            <span className="text-xs text-slate-400 font-medium">high-match awards</span>
          </div>
        </Card>

        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Peak AI Match
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-extrabold text-emerald-600">
              96%
            </p>
            <span className="text-xs text-emerald-600 font-medium">AICTE Pragati</span>
          </div>
        </Card>

        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Average Compatibility
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-extrabold text-blue-600">
              89.5%
            </p>
            <span className="text-xs text-blue-600 font-medium">Strong profile fit</span>
          </div>
        </Card>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((scholarship, index) => (
          <Card key={scholarship.id} className="p-6 transition-all hover:shadow-md" hover>
            {/* Top Bar */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-extrabold text-sm text-blue-700 shrink-0">
                  #{index + 1}
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-lg font-bold text-slate-900">
                    {scholarship.name}
                  </h2>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{scholarship.provider}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2 pt-1">
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100/80 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      <Award className="w-3.5 h-3.5" /> {scholarship.amount}
                    </span>

                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100/80 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      <Calendar className="w-3.5 h-3.5" /> Deadline: {scholarship.deadline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Match Score Display */}
              <div className="flex items-center lg:flex-col lg:items-end justify-between gap-2 shrink-0 bg-slate-50 lg:bg-transparent p-3 lg:p-0 rounded-xl">
                <div className="text-left lg:text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    AI Match
                  </span>
                  <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                    {scholarship.match}%
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                  Top Tier Fit
                </span>
              </div>
            </div>

            {/* Profile Match Meter */}
            <div className="mt-5 space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Match Accuracy</span>
                <span className="text-emerald-600">{scholarship.match}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${scholarship.match}%` }}
                ></div>
              </div>
            </div>

            {/* Why AI Recommended This */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Why AI Recommended This For You
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {scholarship.reasons.map((reason, reasonIndex) => (
                  <div
                    key={reasonIndex}
                    className="flex items-start gap-2 text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-snug">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Predicted Selection Chance Bar */}
            <div className="mt-4 p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-purple-900">Predicted Selection Chance:</span>
                <span className="font-extrabold text-purple-700 text-sm">{scholarship.chance}%</span>
              </div>
              <span className="text-[11px] font-medium text-purple-600 hidden sm:inline">
                Based on historical award rates
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 mt-5 pt-3 border-t border-slate-100">
              <Link
                to={`/scholarships/${scholarship.id}`}
                className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition"
              >
                View Details
              </Link>

              <Button
                className="flex-1"
                size="sm"
                onClick={() => navigate(`/scholarships/${scholarship.id}/apply`)}
                icon={ArrowRight}
              >
                Apply Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
