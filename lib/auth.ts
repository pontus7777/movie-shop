import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin as adminPlugin } from 'better-auth/plugins'

import { ac, admin, myCustomRole, user } from '@/lib/permissions'

import 'dotenv/config'
import prisma from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  baseURL: process.env['BETTER_AUTH_URL'],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
        myCustomRole,
      },
    }),
  ],
})
