import { useState } from "react";
import {
  User,
  Building2,
  GraduationCap,
  Calendar,
  Award,
  IndianRupee,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import DonutChart from "../../components/charts/DonutChart";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { user } = useAuth();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Student Identity & Academic Record
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Student Profile
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Keep your academic and financial credentials up-to-date to unlock high-accuracy scholarship matches.
        </p>
      </div>

      {/* Profile Overview Card with Donut Score */}
      <Card className="p-6 sm:p-8" hover={false}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar and basic info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "S"}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {user?.name || "Student"}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Scholar
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {user?.email || "student@example.com"}
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>ScholarMate AI Match Active</span>
              </div>
            </div>
          </div>

          {/* Profile Completion Donut Widget */}
          <div className="flex items-center gap-5 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shrink-0">
            <div className="w-20 h-20">
              <DonutChart
                value={85}
                maxValue={100}
                size={80}
                strokeWidth={10}
                primaryColor="#2563eb"
                centerValue="85%"
                centerLabel=""
              />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">Profile Completion</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Complete missing fields to reach 100%
              </p>
              <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mt-1.5">
                2 fields remaining
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully! Your AI recommendations have been updated.</span>
        </div>
      )}

      {/* Main Profile Form */}
      <Card className="p-6 sm:p-8" hover={false}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Personal & Contact Details */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Personal & College Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-xs">
              {/* Full Name */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  defaultValue={user?.name || "Student"}
                  className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              {/* College */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  College / Institution Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your college name"
                  defaultValue="Government College of Engineering"
                  className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* 2. Academic Enrollment */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Academic Program & Standing
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 text-xs">
              {/* Branch */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Branch
                </label>
                <select
                  defaultValue="Artificial Intelligence & Machine Learning"
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
                >
                  <option value="">Select Branch</option>
                  <option>Artificial Intelligence & Machine Learning</option>
                  <option>Computer Science</option>
                  <option>Information Technology</option>
                  <option>Electronics & Telecommunication</option>
                  <option>Mechanical Engineering</option>
                  <option>Civil Engineering</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Year of Study
                </label>
                <select
                  defaultValue="3rd Year"
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
                >
                  <option value="">Select Year</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>

              {/* CGPA */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cumulative CGPA (0 - 10)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="Example: 8.5"
                  defaultValue="8.2"
                  className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* 3. Financial & Demographic Details */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Financial, Reservation & Domicile
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 text-xs">
              {/* Family Income */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Annual Family Income (INR)
                </label>
                <input
                  type="number"
                  placeholder="Example: 250000"
                  defaultValue="300000"
                  className="w-full bg-slate-50/50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Social Category
                </label>
                <select
                  defaultValue="OBC"
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
                >
                  <option value="">Select Category</option>
                  <option>Open</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>EWS</option>
                  <option>Other</option>
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Permanent Domicile State
                </label>
                <select
                  defaultValue="Maharashtra"
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
                >
                  <option value="">Select State</option>
                  <option>Maharashtra</option>
                  <option>Karnataka</option>
                  <option>Gujarat</option>
                  <option>Goa</option>
                  <option>Madhya Pradesh</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  defaultValue="Male"
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </div>

              {/* Disability */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Disability Status (PwD)
                </label>
                <select
                  defaultValue="No"
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
                >
                  <option value="">Select Status</option>
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end pt-5 border-t border-slate-100">
            <Button type="submit" size="md">
              Save Profile Credentials
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Profile;
