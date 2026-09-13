export const AUDIT_DEVICES = {
  DESKTOP: "desktop",
  MOBILE: "mobile",
};

export const AUDIT_DEVICE_LABELS = {
  [AUDIT_DEVICES.DESKTOP]:
    "Desktop",

  [AUDIT_DEVICES.MOBILE]:
    "Mobile",
};

export const AUDIT_STATUS = {
  PENDING: "pending",
  QUEUED: "queued",
  RUNNING: "running",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
};

export const AUDIT_STATUS_LABELS = {
  [AUDIT_STATUS.PENDING]:
    "Pending",

  [AUDIT_STATUS.QUEUED]:
    "Queued",

  [AUDIT_STATUS.RUNNING]:
    "Running",

  [AUDIT_STATUS.COMPLETED]:
    "Completed",

  [AUDIT_STATUS.FAILED]:
    "Failed",

  [AUDIT_STATUS.CANCELLED]:
    "Cancelled",
};

export const AUDIT_CATEGORIES = {
  PERFORMANCE: "performance",
  ACCESSIBILITY: "accessibility",
  BEST_PRACTICES:
    "bestPractices",
  SEO: "seo",
};

export const AUDIT_CATEGORY_LABELS = {
  [AUDIT_CATEGORIES.PERFORMANCE]:
    "Performance",

  [AUDIT_CATEGORIES.ACCESSIBILITY]:
    "Accessibility",

  [AUDIT_CATEGORIES.BEST_PRACTICES]:
    "Best Practices",

  [AUDIT_CATEGORIES.SEO]:
    "SEO",
};

export const ISSUE_SEVERITY = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

export const ISSUE_SEVERITY_LABELS = {
  [ISSUE_SEVERITY.HIGH]:
    "High",

  [ISSUE_SEVERITY.MEDIUM]:
    "Medium",

  [ISSUE_SEVERITY.LOW]:
    "Low",
};

export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  NEEDS_IMPROVEMENT: 50,
};

export const AUDIT_DEFAULTS = {
  DEVICE: AUDIT_DEVICES.DESKTOP,

  STATUS:
    AUDIT_STATUS.PENDING,

  PAGE_SIZE: 10,
};

export const CORE_WEB_VITALS = {
  LCP: "lcp",
  INP: "inp",
  CLS: "cls",
  FCP: "fcp",
};

export const CORE_WEB_VITAL_LABELS = {
  [CORE_WEB_VITALS.LCP]:
    "Largest Contentful Paint",

  [CORE_WEB_VITALS.INP]:
    "Interaction to Next Paint",

  [CORE_WEB_VITALS.CLS]:
    "Cumulative Layout Shift",

  [CORE_WEB_VITALS.FCP]:
    "First Contentful Paint",
};