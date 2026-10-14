function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function hasValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function compareListCriterion(label, criterionValues, profileValue, key) {
  // An empty list means no usable criterion has been provided.
  if (!Array.isArray(criterionValues) || criterionValues.length === 0) {
    return null;
  }

  if (!hasValue(profileValue)) {
    return {
      key,
      label,
      status: "unknown",
      message: `Enter your ${label.toLowerCase()} to check this requirement.`,
    };
  }

  const matches = criterionValues.some(
    (value) => normalize(value) === normalize(profileValue),
  );

  return {
    key,
    label,
    status: matches ? "pass" : "fail",
    message: matches
      ? `${label}: requirement matched.`
      : `${label}: your profile does not match the specified requirement.`,
  };
}

function compareMinimumScore(criteria, profile) {
  if (criteria.minimumScore == null) {
    return null;
  }

  const requiredScoreType = normalize(criteria.scoreType);
  const studentScoreType = normalize(profile.scoreType);

  if (
    !hasValue(profile.currentScore) ||
    !requiredScoreType ||
    !studentScoreType
  ) {
    return {
      key: "minimumScore",
      label: "Academic score",
      status: "unknown",
      message: "Enter your score and score type to check this requirement.",
    };
  }

  if (requiredScoreType !== studentScoreType) {
    return {
      key: "minimumScore",
      label: "Academic score",
      status: "unknown",
      message:
        "The scholarship and profile use different score types; their scores cannot be compared directly.",
    };
  }

  const studentScore = Number(profile.currentScore);
  const minimumScore = Number(criteria.minimumScore);

  if (!Number.isFinite(studentScore) || !Number.isFinite(minimumScore)) {
    return {
      key: "minimumScore",
      label: "Academic score",
      status: "unknown",
      message: "A valid academic score is required.",
    };
  }

  const passed = studentScore >= minimumScore;

  return {
    key: "minimumScore",
    label: "Academic score",
    status: passed ? "pass" : "fail",
    message: passed
      ? "Your academic score meets the specified minimum."
      : "Your academic score is below the specified minimum.",
  };
}

function compareMaximumIncome(criteria, profile) {
  if (criteria.maximumAnnualFamilyIncome == null) {
    return null;
  }

  if (!hasValue(profile.annualFamilyIncome)) {
    return {
      key: "maximumAnnualFamilyIncome",
      label: "Annual family income",
      status: "unknown",
      message: "Enter your annual family income to check this requirement.",
    };
  }

  const income = Number(profile.annualFamilyIncome);
  const maximumIncome = Number(criteria.maximumAnnualFamilyIncome);

  if (
    !Number.isFinite(income) ||
    income < 0 ||
    !Number.isFinite(maximumIncome) ||
    maximumIncome < 0
  ) {
    return {
      key: "maximumAnnualFamilyIncome",
      label: "Annual family income",
      status: "unknown",
      message: "A valid family income and income limit are required.",
    };
  }

  const passed = income <= maximumIncome;

  return {
    key: "maximumAnnualFamilyIncome",
    label: "Annual family income",
    status: passed ? "pass" : "fail",
    message: passed
      ? "Your family income is within the specified limit."
      : "Your family income exceeds the specified limit.",
  };
}

export function evaluateEligibility(profile, scholarship) {
  if (!profile || !scholarship) {
    return {
      status: "unknown",
      eligible: null,
      checks: [],
      message: "A student profile and scholarship record are required.",
    };
  }

  // Never make an eligibility claim using unverified demo data.
  if (
    scholarship.eligibilityVerified !== true ||
    scholarship.dataStatus === "demo"
  ) {
    return {
      status: "unverified",
      eligible: null,
      checks: [],
      message:
        "Eligibility cannot be determined because this scholarship's criteria have not been verified.",
    };
  }

  const criteria = scholarship.criteria;

  if (!criteria || typeof criteria !== "object") {
    return {
      status: "criteria_incomplete",
      eligible: null,
      checks: [],
      message: "Verified eligibility criteria are not available.",
    };
  }

  const checks = [
    compareListCriterion(
      "Education level",
      criteria.educationLevels,
      profile.educationLevel,
      "educationLevels",
    ),
    compareListCriterion(
      "Academic branch",
      criteria.branches,
      profile.branch,
      "branches",
    ),
    compareMinimumScore(criteria, profile),
    compareMaximumIncome(criteria, profile),
    compareListCriterion(
      "Social category",
      criteria.categories,
      profile.category,
      "categories",
    ),
    compareListCriterion(
      "Domicile state",
      criteria.states,
      profile.domicileState || profile.state,
      "states",
    ),
    compareListCriterion("Gender", criteria.genders, profile.gender, "genders"),
    compareListCriterion(
      "Disability status",
      criteria.disabilityStatus == null ? [] : [criteria.disabilityStatus],
      profile.disabilityStatus,
      "disabilityStatus",
    ),
  ].filter(Boolean);

  if (checks.length === 0) {
    return {
      status: "criteria_incomplete",
      eligible: null,
      checks: [],
      message:
        "No applicable eligibility requirements are available to compare.",
    };
  }

  const hasFailure = checks.some((check) => check.status === "fail");
  const hasUnknown = checks.some((check) => check.status === "unknown");

  if (hasFailure) {
    return {
      status: "not_eligible",
      eligible: false,
      checks,
      message:
        "Your profile does not meet at least one specified requirement. Review the results and verify the official rules.",
    };
  }

  if (hasUnknown) {
    return {
      status: "incomplete_profile",
      eligible: null,
      checks,
      message:
        "Some required profile details are missing or cannot be compared. Complete them before reassessing.",
    };
  }

  return {
    status: "eligible",
    eligible: true,
    checks,
    message:
      "Your profile matches all currently specified criteria. Verify the official scholarship rules before applying.",
  };
}
