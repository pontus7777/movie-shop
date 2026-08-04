export const SUPER_ADMIN_EMAIL = 'admin@admin.com'

export function isSuperAdmin(email: string): boolean {
  return email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
}
