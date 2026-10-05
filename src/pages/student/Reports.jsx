import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Printer,
  Download,
  User,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  Award,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import DonutChart from "../../components/charts/DonutChart";

function Reports() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      window.print();
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Comprehensive Student Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic & Scholarship Report
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Official summary of your profile strength, AI eligibility analysis, and application outcomes.
          </p>
        </div>

        <Button
          onClick={handlePrint}
          disabled={isGenerating}
          icon={Printer}
          className="shrink-0"
        >
          {isGenerating ? "Preparing Report..." : "Print / Export PDF Report"}
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Completion */}
        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Profile Strength
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-3xl font-extrabold text-slate-900">85%</h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Strong
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: "85%" }}
            ></div>
          </div>
        </Card>

        {/* Scholarships Matched */}
        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Scholarships Matched
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">12</h2>
          <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> High compatibility
          </p>
        </Card>

        {/* Applications */}
        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Applications
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">5</h2>
          <p className="text-xs font-semibold text-blue-600 mt-1">
            1 Approved, 1 in Review
          </p>
        </Card>

        {/* Success Chance */}
        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Peak Selection Chance
          </p>
          <h2 className="text-3xl font-extrabold text-purple-700 mt-2">85%</h2>
          <p className="text-xs font-semibold text-purple-600 mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Top percentile candidate
          </p>
        </Card>
      </div>

      {/* Profile Analysis Section */}
      <Card className="p-6" hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Profile Eligibility Audit
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated institutional scoring across key evaluation pillars
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/profile")}
            icon={ArrowRight}
          >
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">Academic Performance</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">90%</h3>
            <span className="inline-block font-semibold text-emerald-600 mt-1">
              ✓ Verified Strong Standing
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">Financial Eligibility</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">95%</h3>
            <span className="inline-block font-semibold text-emerald-600 mt-1">
              ✓ Highly Qualified
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-medium">Profile Completeness</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">85%</h3>
            <span className="inline-block font-semibold text-amber-600 mt-1">
              ⚠ 2 attributes remaining
            </span>
          </div>
        </div>
      </Card>

      {/* AI Scholarship Analysis List */}
      <Card className="p-6" hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              AI Scholarship Recommendations Overview
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Summary of matched scholarships prioritized by probability score
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/recommendations")}
            icon={ArrowRight}
          >
            All Recommendations
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                AICTE Pragati Scholarship
              </h3>
              <p className="text-slate-500 mt-0.5">Approved technical engineering degree match</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold w-fit">
              96% AI Match
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                National Scholarship
              </h3>
              <p className="text-slate-500 mt-0.5">Central sector higher education eligibility match</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold w-fit">
              91% AI Match
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Maharashtra State Scholarship
              </h3>
              <p className="text-slate-500 mt-0.5">State domicile and recognized university match</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold w-fit">
              87% AI Match
            </span>
          </div>
        </div>
      </Card>

      {/* Success Prediction & Improvement Roadmap Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Prediction */}
        <Card className="p-6" hover={false}>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                Predicted Selection Outcome
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/prediction")}
              icon={ArrowRight}
            >
              Analyze
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
            <div className="w-28 h-28 shrink-0">
              <DonutChart
                value={85}
                size={110}
                strokeWidth={12}
                primaryColor="#10b981"
                centerValue="85%"
                centerLabel=""
              />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <h3 className="text-sm font-bold text-slate-900">
                Tier-1 Selection Potential
              </h3>
              <p className="leading-relaxed">
                Your combination of high academic percentile and verified family income documents places you in the top candidate category.
              </p>
              <p className="text-emerald-700 font-semibold pt-1">
                💡 Submitting before 30 Sep deadline ensures fast-track processing.
              </p>
            </div>
          </div>
        </Card>

        {/* Improvement Roadmap */}
        <Card className="p-6" hover={false}>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Profile Improvement Opportunities
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/improvements")}
              icon={ArrowRight}
            >
              Roadmap
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Improve Semester CGPA</p>
                <p className="text-slate-500 mt-0.5">Reach 8.0+ for merit endowments</p>
              </div>
              <span className="font-extrabold text-emerald-600 text-sm">+8%</span>
            </div>

            <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Upload Current Year Income Certificate</p>
                <p className="text-slate-500 mt-0.5">Expedites welfare board clearance</p>
              </div>
              <span className="font-extrabold text-emerald-600 text-sm">+6%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Advisory Notice */}
      <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-500">
        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Notice:</strong> This audit report compiles verified profile data and automated AI recommendations. Official scholarship selection is administered solely by the respective institutional or government scholarship portals.
        </p>
      </div>
    </div>
  );
}

export default Reports;
