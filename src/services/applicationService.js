import { getCurrentUserEmail } from "./studentProfileService";

const APPLICATION_STORAGE_PREFIX = "scholarmate_applications:";

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function getStorageKey(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new Error("Please log in before accessing applications.");
  }

  return APPLICATION_STORAGE_PREFIX + encodeURIComponent(normalizedEmail);
}

function generateApplicationId() {
  const timestamp = Date.now().toString(36).toUpperCase();

  const randomPart =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto
          .randomUUID()
          .replaceAll("-", "")
          .slice(0, 8)
          .toUpperCase()
      : Math.random().toString(36).slice(2, 10).toUpperCase();

  return `SM-${timestamp}-${randomPart}`;
}

function readApplications(email) {
  const rawData = localStorage.getItem(getStorageKey(email));

  if (!rawData) {
    return [];
  }

  const parsedData = JSON.parse(rawData);

  if (!Array.isArray(parsedData)) {
    return [];
  }

  return parsedData.filter((item) => item && typeof item === "object");
}

function writeApplications(applications, email) {
  localStorage.setItem(getStorageKey(email), JSON.stringify(applications));
}

/**
 * Get all applications belonging to the specified student.
 * Results are sorted newest first.
 */
export function getStudentApplications(email = getCurrentUserEmail()) {
  if (!normalizeEmail(email)) {
    return [];
  }

  try {
    return readApplications(email).sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();

      return dateB - dateA;
    });
  } catch {
    return [];
  }
}

/**
 * Find one application belonging to the specified student.
 */
export function getApplicationById(
  applicationId,
  email = getCurrentUserEmail(),
) {
  if (!applicationId || !normalizeEmail(email)) {
    return null;
  }

  const applications = getStudentApplications(email);

  return (
    applications.find(
      (application) =>
        application.id === applicationId ||
        application.applicationId === applicationId,
    ) || null
  );
}

/**
 * Save a new application or update an existing application.
 *
 * This function saves a local prototype record only.
 * It does not submit anything to an official scholarship portal.
 */
export function saveApplication(application, email = getCurrentUserEmail()) {
  if (!application || typeof application !== "object") {
    throw new Error("Valid application details are required.");
  }

  if (!normalizeEmail(email)) {
    throw new Error("Please log in before saving an application.");
  }

  const scholarshipId =
    application.scholarshipId || application.scholarship?.id || "";

  const scholarshipName =
    application.scholarshipName || application.scholarship?.name || "";

  if (!scholarshipId) {
    throw new Error("The scholarship ID is required.");
  }

  if (!scholarshipName) {
    throw new Error("The scholarship name is required.");
  }

  const applications = readApplications(email);

  const existingId = application.id || application.applicationId || "";

  const existingIndex = existingId
    ? applications.findIndex(
        (item) => item.id === existingId || item.applicationId === existingId,
      )
    : -1;

  const existing = existingIndex >= 0 ? applications[existingIndex] : null;

  const now = new Date().toISOString();
  const id =
    existing?.id ||
    application.id ||
    application.applicationId ||
    generateApplicationId();

  const status = application.status || "Submitted";

  const savedApplication = {
    ...existing,
    ...application,

    id,
    applicationId: id,
    userEmail: normalizeEmail(email),

    scholarshipId,
    scholarshipName,

    status,

    createdAt: existing?.createdAt || now,
    updatedAt: now,

    submittedAt:
      application.submittedAt ||
      existing?.submittedAt ||
      (status === "Submitted" ? now : null),

    formData:
      application.formData && typeof application.formData === "object"
        ? application.formData
        : existing?.formData || {},

    documents: Array.isArray(application.documents)
      ? application.documents
      : existing?.documents || [],
  };

  if (existingIndex >= 0) {
    applications[existingIndex] = savedApplication;
  } else {
    applications.push(savedApplication);
  }

  writeApplications(applications, email);

  return savedApplication;
}

/**
 * Update a saved application belonging to the specified student.
 */
export function updateApplication(
  applicationId,
  updates,
  email = getCurrentUserEmail(),
) {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  if (!updates || typeof updates !== "object") {
    throw new Error("Valid application updates are required.");
  }

  const existing = getApplicationById(applicationId, email);

  if (!existing) {
    throw new Error("Application not found.");
  }

  return saveApplication(
    {
      ...existing,
      ...updates,
      id: existing.id,
      applicationId: existing.applicationId,
      scholarshipId: existing.scholarshipId,
      scholarshipName: existing.scholarshipName,
      createdAt: existing.createdAt,
    },
    email,
  );
}

/**
 * Delete one locally saved application.
 */
export function deleteApplication(
  applicationId,
  email = getCurrentUserEmail(),
) {
  if (!applicationId || !normalizeEmail(email)) {
    return false;
  }

  const applications = readApplications(email);

  const remaining = applications.filter(
    (application) =>
      application.id !== applicationId &&
      application.applicationId !== applicationId,
  );

  if (remaining.length === applications.length) {
    return false;
  }

  writeApplications(remaining, email);

  return true;
}


export const APPLICATION_STATUSES = [
  "Saved",
  "In Progress",
  "Applied",
  "Approved",
  "Rejected",
];

/**
 * Add a scholarship to the student's personal tracker.
 *
 * Existing tracker entries for the same scholarship are reused
 * to avoid duplicate records.
 */
export function addScholarshipToTracker(
  scholarship,
  email = getCurrentUserEmail(),
) {
  if (!scholarship || !scholarship.id || !scholarship.name) {
    throw new Error("Valid scholarship details are required.");
  }

  if (!email || !email.trim()) {
    throw new Error("Please log in before saving a scholarship.");
  }

  const existing = getStudentApplications(email).find(
    (application) => application.scholarshipId === scholarship.id,
  );

  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();

  return saveApplication(
    {
      scholarshipId: scholarship.id,
      scholarshipName: scholarship.name,
      provider: scholarship.provider || "",
      status: "Saved",
      trackingType: "scholarship",
      statusUpdatedAt: now,
      statusSource: "student_reported",
      formData: {},
      documents: [],
    },
    email,
  );
}

/**
 * Change an application's tracker status based on the student's
 * manual update. This does not contact the scholarship provider.
 */
export function updateApplicationStatus(
  applicationId,
  newStatus,
  email = getCurrentUserEmail(),
) {
  if (!APPLICATION_STATUSES.includes(newStatus)) {
    throw new Error("Please select a valid application status.");
  }

  const existing = getApplicationById(applicationId, email);

  if (!existing) {
    throw new Error("Tracker entry not found.");
  }

  const now = new Date().toISOString();

  return updateApplication(
    applicationId,
    {
      status: newStatus,
      statusUpdatedAt: now,
      statusSource: "student_reported",

      // Record when the student marks the application as applied.
      // This is not an official submission timestamp.
      appliedAt:
        newStatus === "Applied"
          ? existing.appliedAt || now
          : existing.appliedAt || null,
    },
    email,
  );
}

