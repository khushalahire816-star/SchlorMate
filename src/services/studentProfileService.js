const PROFILE_STORAGE_PREFIX = "scholarmate_profile:";

export const EMPTY_STUDENT_PROFILE = {
  fullName: "",
  educationLevel: "",
  degree: "",
  branch: "",
  currentYear: "",
  academicYear: "",
  institutionName: "",
  scoreType: "",
  currentScore: "",
  previous10thScore: "",
  previous12thScore: "",
  state: "",
  domicileState: "",
  annualFamilyIncome: "",
  category: "",
  ewsStatus: "",
  gender: "",
  disabilityStatus: "",
};

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export function getCurrentUserEmail() {
  try {
    const savedUser = localStorage.getItem("scholarmate_user");

    if (!savedUser) return "";

    const user = JSON.parse(savedUser);
    return normalizeEmail(user?.email);
  } catch {
    return "";
  }
}

function getProfileStorageKey(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new Error("A valid student email is required.");
  }

  return PROFILE_STORAGE_PREFIX + encodeURIComponent(normalizedEmail);
}

export function getStudentProfile(email = getCurrentUserEmail()) {
  if (!normalizeEmail(email)) {
    return { ...EMPTY_STUDENT_PROFILE };
  }

  try {
    const key = getProfileStorageKey(email);
    const savedProfile = localStorage.getItem(key);

    if (!savedProfile) {
      return { ...EMPTY_STUDENT_PROFILE };
    }

    const parsedProfile = JSON.parse(savedProfile);

    if (
      !parsedProfile ||
      typeof parsedProfile !== "object" ||
      Array.isArray(parsedProfile)
    ) {
      return { ...EMPTY_STUDENT_PROFILE };
    }

    return {
      ...EMPTY_STUDENT_PROFILE,
      ...parsedProfile,
    };
  } catch {
    return { ...EMPTY_STUDENT_PROFILE };
  }
}

export function saveStudentProfile(profile, email = getCurrentUserEmail()) {
  if (!normalizeEmail(email)) {
    throw new Error("Please log in before saving your profile.");
  }

  const cleanProfile = {};

  for (const field of Object.keys(EMPTY_STUDENT_PROFILE)) {
    const value = profile?.[field];

    cleanProfile[field] =
      value === null || value === undefined ? "" : String(value).trim();
  }

  const savedProfile = {
    ...cleanProfile,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    getProfileStorageKey(email),
    JSON.stringify(savedProfile),
  );

  return savedProfile;
}

export function getProfileCompletion(profile = getStudentProfile()) {
  const requiredFields = [
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

  const completedFields = requiredFields.filter((field) => {
    return String(profile?.[field] ?? "").trim() !== "";
  });

  return Math.round((completedFields.length / requiredFields.length) * 100);
}
