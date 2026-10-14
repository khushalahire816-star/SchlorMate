import { useEffect, useMemo, useState } from "react";
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
  IndianRupee,
  Target,
} from "lucide-react";

import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";

import {
  getStudentProfile,
  getProfileCompletion,
} from "../../services/studentProfileService";

function buildImprovements(profile, completion) {
  const score = Number(profile.currentScore);
  const hasScore =
    profile.currentScore !== "" && Number.isFinite(score) && score >= 0;

  const isCGPA = profile.scoreType === "CGPA";

  const academicItem = !hasScore
    ? {
        title: "Add Your Current Academic Score",
        description:
          "Enter your current CGPA or percentage in your student profile to help evaluate scholarship requirements.",
        impact: "+8%",
        priority: "High",
        icon: TrendingUp,
        actionText: "Add Academic Score",
      }
    : isCGPA && score < 8
      ? {
          title: "Improve Your Academic CGPA",
          description: `Your recorded CGPA is ${score}. Focus on strengthening your academic performance and work towards your target score.`,
          impact: "+8%",
          priority: "High",
          icon: TrendingUp,
          actionText: "Review Academic Details",
        }
      : {
          title: "Maintain Your Academic Performance",
          description: `Your recorded ${isCGPA ? "CGPA" : "percentage"} is ${score}. Keep your academic records updated and maintain consistent performance.`,
          impact: "+8%",
          priority: "High",
          icon: GraduationCap,
          actionText: "Review Academic Details",
        };

  const hasIncome = String(profile.annualFamilyIncome ?? "").trim() !== "";

  const incomeItem = {
    title: hasIncome
      ? "Keep Your Income Documents Ready"
      : "Add Annual Family Income",
    description: hasIncome
      ? `Your saved annual family income is ₹${Number(
          profile.annualFamilyIncome,
        ).toLocaleString(
          "en-IN",
        )}. Keep the relevant supporting income certificate ready when applying for scholarships.`
      : "Add your annual family income to your profile. This information can help compare your details against income-based scholarship criteria.",
    impact: "+6%",
    priority: "High",
    icon: IndianRupee,
    actionText: hasIncome ? "Review Income Details" : "Add Family Income",
  };

  const profileItem = {
    title:
      completion < 100
        ? "Complete Your Student Profile"
        : "Review Your Profile Details",
    description:
      completion < 100
        ? `Your profile is ${completion}% complete. Fill in the remaining required fields to improve the information available for scholarship matching.`
        : "Your required profile fields are complete. Review them regularly and keep your academic and financial details current.",
    impact: "+4%",
    priority: "Medium",
    icon: UserCheck,
    actionText: completion < 100 ? "Complete Profile" : "Review Profile",
  };

  const missingAcademicHistory = [
    profile.previous10thScore,
    profile.previous12thScore,
  ].filter((value) => String(value ?? "").trim() === "").length;

  const academicHistoryItem = {
    title:
      missingAcademicHistory > 0
        ? "Add Previous Academic Records"
        : "Maintain Your Academic Records",
    description:
      missingAcademicHistory > 0
        ? "Add your 10th and 12th percentage details where applicable. Keep your original marksheets available for scholarship applications."
        : "Your previous academic scores are recorded. Keep your marksheets organised so you can use them when applying.",
    impact: "+3%",
    priority: "Medium",
    icon: FileText,
    actionText: "Update Academic Records",
  };

  const hasCategoryAndDomicile =
    String(profile.category ?? "").trim() !== "" &&
    String(profile.domicileState || profile.state || "").trim() !== "";

  const eligibilityItem = {
    title: hasCategoryAndDomicile
      ? "Review Scholarship Opportunities"
      : "Complete Category and Domicile Details",
    description: hasCategoryAndDomicile
      ? "Explore scholarship opportunities and compare their requirements with your academic, financial, and domicile information."
      : "Fill in your social category and permanent domicile state where applicable. These details may be relevant to specific scholarship requirements.",
    impact: "+3%",
    priority: "Low",
    icon: hasCategoryAndDomicile ? Award : Target,
    actionText: hasCategoryAndDomicile
      ? "Explore Scholarships"
      : "Update Profile",
    actionPath: hasCategoryAndDomicile ? "/scholarships" : "/profile",
  };

  return [
    {
      id: 1,
      ...academicItem,
      actionPath: "/profile",
    },
    {
      id: 2,
      ...incomeItem,
      actionPath: "/profile",
    },
    {
      id: 3,
      ...profileItem,
      actionPath: "/profile",
    },
    {
      id: 4,
      ...academicHistoryItem,
      actionPath: "/profile",
    },
    {
      id: 5,
      ...eligibilityItem,
    },
  ];
}

function Improvements() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const savedProfile = getStudentProfile(user?.email || undefined);

    setProfile(savedProfile);
  }, [user?.email]);

  const completion = profile ? getProfileCompletion(profile) : 0;

  const improvements = useMemo(() => {
    if (!profile) return [];

    return buildImprovements(profile, completion);
  }, [profile, completion]);

  const milestones = useMemo(() => {
    if (!profile) return [];

    return [
      Boolean(String(profile.currentScore ?? "").trim()),
      Boolean(String(profile.annualFamilyIncome ?? "").trim()),
      completion === 100,
      Boolean(
        String(profile.previous10thScore ?? "").trim() &&
        String(profile.previous12thScore ?? "").trim(),
      ),
      Boolean(
        String(profile.category ?? "").trim() &&
        String(profile.domicileState || profile.state || "").trim(),
      ),
    ];
  }, [profile, completion]);

  const completedMilestones = milestones.filter(Boolean).length;

  const milestoneProgress = milestones.length
    ? Math.round((completedMilestones / milestones.length) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI Profile Optimizer
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile Improvement Roadmap
        </h1>

        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Discover practical steps to improve your scholarship profile and
          organise your application information.
        </p>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute right-24 -bottom-16 w-48 h-48 rounded-full bg-white/5" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-blue-100 border border-white/10 inline-flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              Your Personal Action Plan
            </span>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Take the Next Step Towards Your Scholarship Goals
            </h2>

            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Focus on your academic records, financial details, profile
              completion, and scholarship requirements to prepare a stronger
              application.
            </p>

            <Button
              size="sm"
              onClick={() => navigate("/profile")}
              icon={ArrowRight}
            >
              Update My Profile
            </Button>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center shrink-0 min-w-44">
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
              Profile Completion
            </span>

            <p className="text-4xl font-extrabold text-white mt-1">
              {completion}%
            </p>

            <div className="w-full h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-300 rounded-full transition-all duration-500"
                style={{
                  width: `${completion}%`,
                }}
              />
            </div>

            <span className="inline-block text-xs font-bold text-emerald-200 bg-emerald-900/30 px-2.5 py-1 rounded-full mt-2">
              {completion === 100 ? "Profile Complete" : "Keep Improving"}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="p-6" hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Improvement Milestones
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              {completedMilestones} of {milestones.length} profile improvement
              goals completed
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-2xl font-extrabold text-blue-600">
              {milestoneProgress}%
            </p>

            <p className="text-xs text-slate-400 font-medium">Goal Progress</p>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 mt-4 overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-700"
            style={{
              width: `${milestoneProgress}%`,
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-5">
          {[
            {
              label: "Academic Score",
              complete: milestones[0],
            },
            {
              label: "Family Income",
              complete: milestones[1],
            },
            {
              label: "Profile Details",
              complete: milestones[2],
            },
            {
              label: "Previous Marks",
              complete: milestones[3],
            },
            {
              label: "Category & Domicile",
              complete: milestones[4],
            },
          ].map((milestone) => (
            <div
              key={milestone.label}
              className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50"
            >
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  milestone.complete ? "text-emerald-600" : "text-slate-300"
                }`}
              />

              <span className="text-xs font-semibold text-slate-700">
                {milestone.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Actionable Recommendations
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Suggestions based on the details saved in your profile.
          </p>
        </div>

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
                  {/* Recommendation Details */}
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

                  {/* Impact and Action */}
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

      {/* Explore More */}
      <Card
        className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200"
        hover={false}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center shrink-0">
              <Code2 className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Explore More Opportunities
              </h3>

              <p className="text-xs text-slate-600 mt-1">
                Review available scholarships and prepare the information needed
                for your applications.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => navigate("/scholarships")}
            icon={ArrowRight}
          >
            Browse Scholarships
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Improvements;
