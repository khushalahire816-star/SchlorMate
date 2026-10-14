import { useEffect, useState } from "react";
import {
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import DonutChart from "../../components/charts/DonutChart";
import { useAuth } from "../../context/AuthContext";

import {
  EMPTY_STUDENT_PROFILE,
  getStudentProfile,
  saveStudentProfile,
  getProfileCompletion,
} from "../../services/studentProfileService";

const inputClass =
  "w-full bg-slate-50/50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";

const selectClass =
  "w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer";

const requiredProfileFields = [
  "fullName",
  "educationLevel",
  "degree",
  "branch",
  "currentYear",
  "academicYear",
  "institutionName",
  "scoreType",
  "currentScore",
  "state",
  "annualFamilyIncome",
];

function FormSection({ number, title, children }) {
  return (
    <section>
      <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
          {number}
        </div>

        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>

      {children}
    </section>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  min,
  max,
  step,
  hint,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className={inputClass}
      />

      {hint && <p className="text-[11px] text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        className={selectClass}
      >
        <option value="">Select {label}</option>

        {options.map((option) => {
          const optionValue =
            typeof option === "string" ? option : option.value;

          const optionLabel =
            typeof option === "string" ? option : option.label;

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function Profile() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    ...EMPTY_STUDENT_PROFILE,
    scoreType: "CGPA",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load the logged-in student's saved profile.
  useEffect(() => {
    const savedProfile = getStudentProfile(user?.email || undefined);

    setFormData({
      ...EMPTY_STUDENT_PROFILE,
      ...savedProfile,
      fullName: savedProfile.fullName || user?.name || "",
      scoreType: savedProfile.scoreType || "CGPA",
    });
  }, [user?.email, user?.name]);

  const completion = getProfileCompletion(formData);

  const missingFields = requiredProfileFields.filter((field) => {
    return String(formData[field] ?? "").trim() === "";
  }).length;

  const displayName = formData.fullName || user?.name || "Student";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => {
      const updatedData = {
        ...previousData,
        [name]: value,
      };

      // Keep the two state fields consistent.
      if (name === "domicileState") {
        updatedData.state = value;
      }

      // EWS is also represented by the social category selection.
      if (name === "category") {
        updatedData.ewsStatus = value === "EWS" ? "Yes" : "No";
      }

      return updatedData;
    });

    setSavedSuccess(false);
    setErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSavedSuccess(false);
    setErrorMessage("");

    if (!user?.email) {
      setErrorMessage(
        "Your account email could not be found. Please log in again before saving your profile.",
      );
      return;
    }

    const missingRequiredFields = requiredProfileFields.filter(
      (field) => String(formData[field] ?? "").trim() === "",
    );

    if (missingRequiredFields.length > 0) {
      setErrorMessage(
        "Please complete all fields marked with an asterisk before saving.",
      );
      return;
    }

    const score = Number(formData.currentScore);
    const familyIncome = Number(formData.annualFamilyIncome);

    const maximumScore = formData.scoreType === "CGPA" ? 10 : 100;

    if (!Number.isFinite(score) || score < 0 || score > maximumScore) {
      setErrorMessage(
        formData.scoreType === "CGPA"
          ? "Please enter a valid CGPA between 0 and 10."
          : "Please enter a valid percentage between 0 and 100.",
      );
      return;
    }

    if (!Number.isFinite(familyIncome) || familyIncome < 0) {
      setErrorMessage(
        "Please enter a valid, non-negative annual family income.",
      );
      return;
    }

    try {
      const savedProfile = saveStudentProfile(formData, user.email);

      setFormData({
        ...EMPTY_STUDENT_PROFILE,
        ...savedProfile,
      });

      setSavedSuccess(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save your profile. Please try again.",
      );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            Student Identity & Academic Record
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Student Profile
        </h1>

        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Keep your academic and financial details up-to-date to help identify
          relevant scholarship opportunities.
        </p>
      </div>

      {/* Profile Overview */}
      <Card className="p-6 sm:p-8" hover={false}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-sm shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {displayName}
                </h2>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Student Account
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {user?.email || "No email available"}
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Profile details for scholarship matching</span>
              </div>
            </div>
          </div>

          {/* Dynamic Profile Completion */}
          <div className="flex items-center gap-5 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shrink-0">
            <div className="w-20 h-20">
              <DonutChart
                value={completion}
                maxValue={100}
                size={80}
                strokeWidth={10}
                primaryColor="#2563eb"
                centerValue={`${completion}%`}
                centerLabel=""
              />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">
                Profile Completion
              </p>

              <p className="text-[11px] text-slate-500 mt-0.5">
                Complete the required fields below.
              </p>

              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${
                  missingFields === 0
                    ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                    : "text-amber-700 bg-amber-50 border border-amber-200"
                }`}
              >
                {missingFields === 0
                  ? "Profile complete"
                  : `${missingFields} required fields remaining`}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Success Message */}
      {savedSuccess && (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your profile has been saved successfully on this device.</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Form */}
      <Card className="p-6 sm:p-8" hover={false}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Details */}
          <FormSection number="1" title="Personal & College Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-xs">
              <InputField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <InputField
                label="College / Institution Name"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                placeholder="Enter your college name"
                required
              />
            </div>
          </FormSection>

          {/* Section 2: Academic Details */}
          <FormSection number="2" title="Academic Program & Standing">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 text-xs">
              <SelectField
                label="Education Level"
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                options={[
                  "Diploma",
                  "Undergraduate",
                  "Postgraduate",
                  "Doctoral",
                  "Other",
                ]}
                required
              />

              <InputField
                label="Degree / Course"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="Example: B.Tech"
                required
              />

              <SelectField
                label="Academic Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                options={[
                  "Artificial Intelligence & Machine Learning",
                  "Computer Science",
                  "Information Technology",
                  "Electronics & Telecommunication",
                  "Mechanical Engineering",
                  "Civil Engineering",
                  "Electrical Engineering",
                  "Other",
                ]}
                required
              />

              <SelectField
                label="Current Year of Study"
                name="currentYear"
                value={formData.currentYear}
                onChange={handleChange}
                options={[
                  "1st Year",
                  "2nd Year",
                  "3rd Year",
                  "4th Year",
                  "5th Year",
                  "Final Year",
                ]}
                required
              />

              <InputField
                label="Academic Year"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="Example: 2026-27"
                required
              />

              <SelectField
                label="Current Score Type"
                name="scoreType"
                value={formData.scoreType}
                onChange={handleChange}
                options={["CGPA", "Percentage"]}
                required
              />

              <InputField
                label={
                  formData.scoreType === "Percentage"
                    ? "Current Percentage (0–100)"
                    : "Current CGPA (0–10)"
                }
                name="currentScore"
                value={formData.currentScore}
                onChange={handleChange}
                type="number"
                min="0"
                max={formData.scoreType === "Percentage" ? "100" : "10"}
                step="0.01"
                placeholder={
                  formData.scoreType === "Percentage"
                    ? "Example: 85.5"
                    : "Example: 8.5"
                }
                required
              />

              <InputField
                label="10th Percentage (Optional)"
                name="previous10thScore"
                value={formData.previous10thScore}
                onChange={handleChange}
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Example: 94.6"
              />

              <InputField
                label="12th Percentage (Optional)"
                name="previous12thScore"
                value={formData.previous12thScore}
                onChange={handleChange}
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Example: 73.81"
              />
            </div>
          </FormSection>

          {/* Section 3: Financial and Demographic Details */}
          <FormSection number="3" title="Financial, Reservation & Domicile">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 text-xs">
              <InputField
                label="Annual Family Income (INR)"
                name="annualFamilyIncome"
                value={formData.annualFamilyIncome}
                onChange={handleChange}
                type="number"
                min="0"
                step="1"
                placeholder="Example: 250000"
                required
              />

              <SelectField
                label="Social Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={["Open", "OBC", "SC", "ST", "EWS", "Other"]}
              />

              <SelectField
                label="Permanent Domicile State"
                name="domicileState"
                value={formData.domicileState}
                onChange={handleChange}
                options={[
                  "Andhra Pradesh",
                  "Assam",
                  "Bihar",
                  "Goa",
                  "Gujarat",
                  "Karnataka",
                  "Kerala",
                  "Madhya Pradesh",
                  "Maharashtra",
                  "Rajasthan",
                  "Tamil Nadu",
                  "Telangana",
                  "Uttar Pradesh",
                  "West Bengal",
                  "Other",
                ]}
                required
              />

              <SelectField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={["Male", "Female", "Other", "Prefer not to say"]}
              />

              <SelectField
                label="Disability Status (PwD)"
                name="disabilityStatus"
                value={formData.disabilityStatus}
                onChange={handleChange}
                options={["No", "Yes"]}
              />
            </div>

            <p className="text-[11px] text-slate-500 mt-4">
              Enter accurate details. Scholarship eligibility requirements
              differ, and filling in this profile does not guarantee scholarship
              eligibility or selection.
            </p>
          </FormSection>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">
              <span className="text-red-500">*</span> Required fields
            </p>

            <Button type="submit" size="md">
              <span className="inline-flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Profile Credentials
              </span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Profile;
