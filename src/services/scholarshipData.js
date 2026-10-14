export const SCHOLARSHIPS = [
  {
    id: "aicte-pragati-demo",
    name: "AICTE Pragati Scholarship",
    provider: "AICTE",

    description:
      "Scholarship opportunity listed through the National Scholarship Portal.",

    benefitAmount: 50000,
    benefitPeriod: "per year",
    deadline: "30 Sep 2026",

    // Official portal links
    applicationPortal: "National Scholarship Portal",
    officialApplyUrl: "https://scholarships.gov.in/Students",
    officialDetailsUrl: "https://scholarships.gov.in/All-Scholarships",

    applicationInstructions:
      "Find the AICTE Pragati Scholarship Scheme for Girl Students (Technical Degree) on the official portal and review its eligibility requirements before applying.",

    eligibilityVerified: false,
    dataStatus: "demo",
    lastVerifiedAt: null,

    criteria: {
      educationLevels: [],
      branches: [],
      minimumScore: null,
      scoreType: null,
      maximumAnnualFamilyIncome: null,
      categories: [],
      states: [],
      genders: [],
      disabilityStatus: null,
    },

    requiredDocuments: [],
  },

  {
    id: "national-scholarship-demo",
    name: "National Scholarship",
    provider: "Government of India",

    description:
      "Explore scholarship schemes available through the National Scholarship Portal.",

    benefitAmount: 30000,
    benefitPeriod: "per year",
    deadline: "15 Oct 2026",

    // Official portal links
    applicationPortal: "National Scholarship Portal",
    officialApplyUrl: "https://scholarships.gov.in/Students",
    officialDetailsUrl: "https://scholarships.gov.in/All-Scholarships",

    applicationInstructions:
      "Search for the exact scholarship scheme on the official portal and check its current application requirements.",

    eligibilityVerified: false,
    dataStatus: "demo",
    lastVerifiedAt: null,

    criteria: {
      educationLevels: [],
      branches: [],
      minimumScore: null,
      scoreType: null,
      maximumAnnualFamilyIncome: null,
      categories: [],
      states: [],
      genders: [],
      disabilityStatus: null,
    },

    requiredDocuments: [],
  },

  {
    id: "maharashtra-state-scholarship-demo",
    name: "Maharashtra State Scholarship",
    provider: "Maharashtra State Government",

    description:
      "Explore Maharashtra scholarship schemes through the official MahaDBT portal.",

    benefitAmount: 25000,
    benefitPeriod: "per year",
    deadline: "31 Oct 2026",

    // Official portal links
    applicationPortal: "MahaDBT 2.0",
    officialApplyUrl: "https://mahadbt2.maharashtra.gov.in/",
    officialDetailsUrl: "https://mahadbt2.maharashtra.gov.in/",

    applicationInstructions:
      "Open MahaDBT 2.0, sign in or register as required, and find the exact scholarship scheme that applies to your profile.",

    eligibilityVerified: false,
    dataStatus: "demo",
    lastVerifiedAt: null,

    criteria: {
      educationLevels: [],
      branches: [],
      minimumScore: null,
      scoreType: null,
      maximumAnnualFamilyIncome: null,
      categories: [],
      states: [],
      genders: [],
      disabilityStatus: null,
    },

    requiredDocuments: [],
  },
];

export function getAllScholarships() {
  return SCHOLARSHIPS;
}

export function getScholarshipById(id) {
  return SCHOLARSHIPS.find((scholarship) => scholarship.id === id) || null;
}
