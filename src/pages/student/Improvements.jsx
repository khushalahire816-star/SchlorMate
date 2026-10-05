import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Sparkles,
  Award,
  FileText,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Code2,
  Lightbulb,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

function Improvements() {
  const navigate = useNavigate();

  const [improvements] = useState([
    {
      id: 1,
      title: "Improve Your Academic CGPA",
      description:
        "Your current recorded CGPA is 7.2. Increasing it to 8.0 or above unlocks tier-1 eligibility for competitive merit-based private trust scholarships.",
      impact: "+8%",
      priority: "High",
      icon: TrendingUp,
      actionPath: "/profile",
      actionText: "Update CGPA in Profile",
    },
    {
      id: 2,
      title: "Upload Current Income Certificate",
      description:
        "An updated government-verified income certificate validates need-based quotas and reduces application scrutiny delays.",
      impact: "+6%",
      priority: "High",
      icon: FileText,
      actionPath: "/profile",
      actionText: "Upload Certificate",
    },
    {
      id: 3,
      title: "Complete All Profile Attributes",
      description:
        "Your profile is currently 85% complete. Adding remaining demographic and domicile details improves recommendation accuracy.",
      impact: "+4%",
      priority: "Medium",
      icon: UserCheck,
      actionPath: "/profile",
      actionText: "Complete Profile",
    },
    {
      id: 4,
      title: "Add Technical Certifications",
      description:
        "Adding verified professional course credentials (e.g. AWS, Python, AI/ML) significantly strengthens corporate trust scholarship profiles.",
      impact: "+3%",
      priority: "Medium",
      icon: Award,
      actionPath: "/profile",
      actionText: "Add Credentials",
    },
    {
      id: 5,
      title: "Document Academic Projects",
      description:
        "Include software engineering capstones or research projects to showcase real-world implementation capability.",
      impact: "+3%",
      priority: "Low",
      icon: Code2,
      actionPath: "/profile",
      actionText: "Add Projects",
    },
  ]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI Profile Optimizer
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile Improvement Roadmap
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Targeted, high-impact actions you can take to maximize your scholarship eligibility and predicted award chances.
        </p>
      </div>

      {/* AI Score Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-blue-100 border border-white/10 inline-flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" /> High Optimization Potential
            </span>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Action Plan: Boost Selection Rate by up to +24%
            </h2>

            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              By fulfilling the top recommended improvements below, your student profile will reach the top tier of competitive eligibility across state and national scholarship programs.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center shrink-0 min-w-44">
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
              Current Baseline
            </span>
            <p className="text-4xl font-extrabold text-white mt-1">85%</p>
            <span className="inline-block text-xs font-bold text-emerald-300 bg-emerald-900/40 px-2.5 py-0.5 rounded-full mt-1.5">
              Strong Standing
            </span>
          </div>
        </div>
      </div>

      {/* Goal Progress Card */}
      <Card className="p-6" hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Improvement Milestones Completed
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              3 of 5 recommended profile actions have been resolved
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-2xl font-extrabold text-blue-600">60%</p>
            <p className="text-xs text-slate-400 font-medium">Goal Progress</p>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 mt-4 overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-700"
            style={{ width: "60%" }}
          ></div>
        </div>
      </Card>

      {/* Recommended Improvements List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Actionable Recommendations
        </h2>

        <div className="space-y-3.5">
          {improvements.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className="p-5 sm:p-6 transition-all hover:shadow-md hover:border-slate-300"
                hover
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {item.title}
                        </h3>

                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            item.priority === "High"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : item.priority === "Medium"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {item.priority} Priority
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Impact pill & action */}
                  <div className="flex items-center lg:flex-col lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Impact
                      </span>
                      <p className="text-xl font-extrabold text-emerald-600">
                        {item.impact}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => navigate(item.actionPath)}
                      icon={ArrowRight}
                    >
                      {item.actionText}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Improvements;
