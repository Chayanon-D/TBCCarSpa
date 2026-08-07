// AWS IAM / Cognito Style Security Checker for Shop Owner

export function isShopOwnerAdmin(lineUserId?: string): boolean {
  const envAdminIds = import.meta.env.VITE_ADMIN_LINE_USER_IDS || '';
  const allowedAdminIds = envAdminIds
    .split(',')
    .map((id: string) => id.replace(/["'\s]/g, '').trim())
    .filter(Boolean);

  const isPlaceholder =
    allowedAdminIds.includes('YOUR_SHOP_OWNER_LINE_USER_ID_HERE') ||
    allowedAdminIds.includes('U1234567890abcdef1234567890abcdef');

  // If set to wildcard '*', empty, or default placeholder, grant access
  if (allowedAdminIds.length === 0 || allowedAdminIds.includes('*') || isPlaceholder) {
    return true;
  }

  // If no LINE User ID is available when strict admin list is active, reject access
  if (!lineUserId) return false;

  const cleanInputId = lineUserId.replace(/["'\s]/g, '').trim();

  // Strictly check if current LINE User ID matches any authorized admin ID in .env
  return allowedAdminIds.includes(cleanInputId);
}
