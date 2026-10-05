import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  Building2,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

function Applications() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("All");

  const [applications] = useState([
    {
      id: 1,
      scholarship: "AICTE Pragati Scholarship",
      provider: "AICTE",
      amount: "₹50,000 / year",
      appliedDate: "05 Sep 2026",
      deadline: "30 Sep 2026",
      status: "Submitted",
      applicationId: "APP-2026-00125",
    },
    {
      id: 2,
      scholarship: "National Scholarship",
      provider: "Government of India",
      amount: "₹30,000 / year",
      appliedDate: "02 Sep 2026",
      deadline: "15 Oct 2026",
      status: "Under Review",
      applicationId: "APP-2026-00098",
    },
    {
      id: 3,
      scholarship: "Maharashtra State Scholarship",
      provider: "Government of Maharashtra",
      amount: "₹25,000 / year",
      appliedDate: "28 Aug 2026",
      deadline: "31 Oct 2026",
      status: "Approved",
      applicationId: "APP-2026-00043",
    },
    {
      id: 4,
      scholarship: "Reliance Foundation Scholarship",
      provider: "Reliance Foundation",
      amount: "₹2,00,000",
      appliedDate: "20 Aug 2026",
      deadline: "15 Nov 2026",
      status: "Rejected",
      applicationId: "APP-2026-00012",
    },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return {
          icon: CheckCircle2,
          classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "Rejected":
        return {
          icon: XCircle,
          classes: "bg-rose-50 text-rose-700 border-rose-200",
        };
      case "Under Review":
        return {
          icon: Clock,
          classes: "bg-amber-50 text-amber-700 border-amber-200",
        };
      default:
        return {
          icon: ClipboardList,
          classes: "bg-blue-50 text-blue-700 border-blue-200",
        };
    }
  };

  const filteredApplications =
    activeTab === "All"
      ? applications
      : applications.filter((app) => app.status === activeTab);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5" /> Student Application Tracking
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Applications
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Track real-time verification and review status across all your submitted scholarship applications.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Submissions
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {applications.length}
            </h2>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
        </Card>

        {/* Submitted */}
        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Submitted
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-3xl font-extrabold text-blue-600 tracking-tight">
              {applications.filter((app) => app.status === "Submitted").length}
            </h2>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
        </Card>

        {/* Under Review */}
        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Under Review
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-3xl font-extrabold text-amber-600 tracking-tight">
              {applications.filter((app) => app.status === "Under Review").length}
            </h2>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </Card>

        {/* Approved */}
        <Card className="p-5" hover>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Approved & Awarded
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-3xl font-extrabold text-emerald-600 tracking-tight">
              {applications.filter((app) => app.status === "Approved").length}
            </h2>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
        {["All", "Submitted", "Under Review", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-xs font-bold"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            {tab} {tab === "All" ? `(${applications.length})` : `(${applications.filter((a) => a.status === tab).length})`}
          </button>
        ))}
      </div>

      {/* Application History Table / Cards */}
      <Card className="overflow-hidden" hover={false}>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Application History & Records
          </h2>
          <span className="text-xs text-slate-400">
            Showing {filteredApplications.length} records
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredApplications.map((app) => {
            const badge = getStatusBadge(app.status);
            const StatusIcon = badge.icon;
            return (
              <div
                key={app.id}
                className="p-5 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {app.scholarship}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {app.applicationId}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.provider}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-500 pt-1">
                      <span className="font-semibold text-slate-800">
                        {app.amount}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Applied: {app.appliedDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Deadline: {app.deadline}
                      </span>
                    </div>
                  </div>

                  {/* Right: Status badge & Action */}
                  <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${badge.classes}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {app.status}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/applications/${app.id}`)}
                      icon={ArrowRight}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default Applications;
