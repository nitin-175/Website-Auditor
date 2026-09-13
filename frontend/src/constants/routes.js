const ROUTES = {
  HOME: "/",

  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",

  APP: "/app",
  DASHBOARD: "/app/dashboard",
  NEW_AUDIT: "/app/new-audit",
  HISTORY: "/app/history",
  COMPARE: "/app/compare",
  SETTINGS: "/app/settings",

  REPORT: (auditId) =>
    `/app/report/${auditId}`,

  UNAUTHORIZED: "/unauthorized",
  SERVER_ERROR: "/server-error",
};

export default ROUTES;