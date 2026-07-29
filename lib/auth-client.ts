import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { ac, admin, user, myCustomRole } from '@/lib/permissions'
import type { auth } from '@/lib/auth'

export const authClient = createAuthClient({
  baseURL: process.env['BETTER_AUTH_URL'],
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        user,
        myCustomRole,
      },
    }),
    inferAdditionalFields<typeof auth>(),
  ],
})
