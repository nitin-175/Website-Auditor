export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const ROLE_LABELS = {
  [ROLES.USER]: "User",
  [ROLES.ADMIN]: "Administrator",
};

export const ROLE_PERMISSIONS = {
  [ROLES.USER]: [
    "audit:create",
    "audit:read",
    "audit:delete",
    "report:read",
    "comparison:read",
    "profile:read",
    "profile:update",
  ],

  [ROLES.ADMIN]: [
    "audit:create",
    "audit:read",
    "audit:delete",
    "report:read",
    "comparison:read",
    "profile:read",
    "profile:update",

    "users:read",
    "users:update",
    "users:delete",
    "system:read",
  ],
};

export function hasPermission(
  role,
  permission
) {
  return (
    ROLE_PERMISSIONS[role]?.includes(
      permission
    ) ?? false
  );
}