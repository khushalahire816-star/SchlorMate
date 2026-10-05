import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Award,
  IndianRupee,
  MapPin,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

function ApplicationForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    cgpa: "",
    familyIncome: "",
    address: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Application Submitted:", {
      scholarshipId: id,
      ...formData,
    });

    navigate("/application-success", {
      state: {
        applicationId: "APP-2026-00125",
        scholarshipName: "AICTE Pragati Scholarship",
        provider: "AICTE",
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          icon={ArrowLeft}
          className="mb-3"
        >
          Back
        </Button>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Scholarship Application Form
        </h1>

        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Complete the official student application details. All information will be verified against institutional records.
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-6 sm:p-8" hover={false}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Information */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name (as per Aadhaar / Official ID) *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    placeholder="e.g. Khushal Sharma"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    placeholder="student@example.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* College */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  College / Institute Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    placeholder="e.g. Pune Institute of Computer Technology"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Information */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Academic & Financial Qualifications
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {/* Branch */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Branch / Degree *
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  placeholder="e.g. AI & Machine Learning"
                />
              </div>

              {/* CGPA */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Cumulative CGPA *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  placeholder="e.g. 8.75"
                />
              </div>

              {/* Family Income */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Annual Family Income (INR) *
                </label>
                <input
                  type="number"
                  name="familyIncome"
                  value={formData.familyIncome}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  placeholder="e.g. 350000"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Permanent Residential Address */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Residential Address & Domicile
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Complete Mailing Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition leading-relaxed"
                placeholder="Flat / House No., Street, City, State, PIN Code"
              />
            </div>
          </div>

          {/* Section 4: Statement of Purpose */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                4
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Statement of Need & Purpose
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Why are you applying for this scholarship? *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows="4"
                className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition leading-relaxed"
                placeholder="Describe your academic goals, financial context, and how this scholarship will support your engineering education..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>

            <Button type="submit" size="md">
              Submit Application
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ApplicationForm;
