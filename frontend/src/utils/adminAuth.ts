// AWS IAM / Cognito Style Security Checker for Shop Owner

export function isShopOwnerAdmin(lineUserId?: string): boolean {
  const envAdminIds = import.meta.env.VITE_ADMIN_LINE_USER_IDS || '';
  const allowedAdminIds = envAdminIds
    .split(',')
    .map((id: string) => id.replace(/["'\s]/g, '').trim())
    .filter(Boolean);

  // If no LINE User ID is available, reject access
  if (!lineUserId) return false;

  const cleanInputId = lineUserId.replace(/["'\s]/g, '').trim();

  // If set to wildcard '*', grant access to all
  if (allowedAdminIds.includes('*')) {
    return true;
  }

  // Strictly check if current LINE User ID matches any authorized admin ID in .env
  return allowedAdminIds.includes(cleanInputId);
}
