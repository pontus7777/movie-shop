import { createAccessControl } from 'better-auth/plugins/access'
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access'

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
  ...defaultStatements,

  project: ['create', 'share', 'update', 'delete'],
  userManagement: ['create', 'update', 'delete', 'view'],
} as const

export const ac = createAccessControl(statement)

export const user = ac.newRole({
  project: ['create'],
})

export const admin = ac.newRole({
  project: ['create', 'update'],
  userManagement: ['create', 'update', 'delete', 'view'],
  ...adminAc.statements,
})

export const myCustomRole = ac.newRole({
  project: ['create', 'update', 'delete'],
  user: ['ban'],
})
