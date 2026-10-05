import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Award,
  AlertCircle,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const application = {
    id,
    scholarship: "AICTE Pragati Scholarship",
    provider: "AICTE",
    amount: "₹50,000 / year",
    appliedDate: "05 Sep 2026",
    deadline: "30 Sep 2026",
    status: "Under Review",
    applicationId: "APP-2026-00125",
  };

  const timeline = [
    {
      title: "Application Submitted",
      date: "05 Sep 2026",
      description: "Application successfully registered on portal and queued for institutional verification.",
      completed: true,
      current: false,
    },
    {
      title: "Institutional Documents Verified",
      date: "06 Sep 2026",
      description: "College nodal officer verified bona fide student admission and marksheets.",
      completed: true,
      current: false,
    },
    {
      title: "State Authority Review",
      date: "07 Sep 2026",
      description: "Application is actively under review with state welfare scrutiny officer.",
      completed: true,
      current: true,
    },
    {
      title: "Merit List & Final Disbursement",
      date: "Pending (Est. Oct 2026)",
      description: "Final merit list publication and Direct Benefit Transfer (DBT) sanction.",
      completed: false,
      current: false,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Navigation Breadcrumb */}
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

      {/* Main Header Card */}
      <Card className="p-6 sm:p-8" hover={false}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                {application.applicationId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {application.scholarship}
            </h1>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{application.provider}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
            </div>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs">
              <Clock className="w-3.5 h-3.5" />
              {application.status}
            </span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Application Ref ID</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
              {application.applicationId}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Award Amount</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {application.amount}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Date Submitted</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {application.appliedDate}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Application Deadline</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {application.deadline}
            </p>
          </div>
        </div>
      </Card>

      {/* Progress Timeline */}
      <Card className="p-6 sm:p-8" hover={false}>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">
            Verification & Review Progression
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-8">
          Detailed multi-stage progression of your scholarship verification.
        </p>

        <div className="max-w-2xl">
          {timeline.map((item, index) => {
            const isLast = index === timeline.length - 1;
            return (
              <div key={index} className="flex gap-4">
                {/* Node icon & connecting line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      item.completed
                        ? item.current
                          ? "bg-amber-100 text-amber-700 ring-4 ring-amber-50"
                          : "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                  >
                    {item.completed ? (
                      item.current ? (
                        <Clock className="w-4 h-4 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {!isLast && (
                    <div
                      className={`w-0.5 h-16 my-1 ${
                        item.completed ? "bg-emerald-300" : "bg-slate-200"
                      }`}
                    ></div>
                  )}
                </div>

                {/* Content */}
                <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`text-sm font-bold ${
                        item.completed ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.date}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Submitted Documents Card */}
      <Card className="p-6" hover={false}>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-purple-600" />
          <h2 className="text-base font-bold text-slate-900">
            Verified Submitted Documents
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          All supporting attachments have passed preliminary automated validation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            "Aadhaar Identity Card",
            "Official Income Certificate",
            "College ID & Bonafide Letter",
            "Official Academic Marksheet",
          ].map((docName, idx) => (
            <div
              key={idx}
              className="border border-slate-200/90 rounded-xl p-3.5 bg-slate-50/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-800">{docName}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default ApplicationDetails;
