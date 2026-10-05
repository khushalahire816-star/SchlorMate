import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  FileText,
  Calendar,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

function ApplicationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const application = location.state || {
    applicationId: "APP-2026-00125",
    scholarshipName: "AICTE Pragati Scholarship",
    provider: "AICTE",
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4 animate-fadeIn">
      <Card className="p-6 sm:p-10 max-w-2xl w-full text-center shadow-md border-slate-200" hover={false}>
        {/* Animated Celebration Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200/90 flex items-center justify-center text-emerald-600 mb-5 shadow-xs">
          <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
        </div>

        {/* Heading */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Application Successfully Received
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Application Submitted!
        </h1>

        <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
          Your application has been logged into the ScholarMate verification system and queued for institutional review.
        </p>

        {/* Application Metadata Card */}
        <Card className="mt-8 bg-slate-50/70 border-slate-200/80 rounded-2xl p-5 sm:p-6 text-left shadow-none" hover={false}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Submission Receipt
            </h2>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Queue
            </span>
          </div>

          <div className="space-y-3.5 mt-4 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="text-slate-500 font-medium">Application Tracking ID</span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 w-fit">
                {application.applicationId}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="text-slate-500 font-medium">Scholarship Program</span>
              <span className="font-bold text-slate-900">
                {application.scholarshipName}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="text-slate-500 font-medium">Governing Provider</span>
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {application.provider}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="text-slate-500 font-medium">Current Status</span>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                <Clock className="w-3 h-3" /> Under Review
              </span>
            </div>
          </div>
        </Card>

        {/* What Happens Next */}
        <div className="mt-6 text-left bg-blue-50/80 border border-blue-100 rounded-2xl p-5">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> What Happens Next?
          </h3>

          <ul className="text-xs text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>Institutional nodal officer reviews academic credentials within 3-5 working days.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>Automated notification alerts will be sent when your application reaches state review.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>You can track progress and updates anytime in your Applications dashboard.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
          <Button
            size="md"
            onClick={() => navigate("/applications")}
            icon={FileText}
          >
            Track in My Applications
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ApplicationSuccess;
