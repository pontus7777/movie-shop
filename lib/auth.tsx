import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin as adminPlugin } from 'better-auth/plugins'

import { ac, admin, myCustomRole, user } from '@/lib/permissions'

import 'dotenv/config'
import prisma from './prisma'
import { nextCookies } from 'better-auth/next-js'
import { sendEmail } from './email'
import { render, toPlainText } from 'react-email'
import EmailVerfication from '@/components/email/templates/email-verification'
import { APIError, createAuthMiddleware } from 'better-auth/api'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  //Add hooks to deactivate users and block sign-in attempts by deactivated users
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Block sign-in attempts by deactivated users
      if (ctx.path.startsWith('/sign-in')) {
        const body = ctx.body as { email?: string }

        if (body?.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: body.email },
            select: { isDeactivated: true },
          })

          if (existingUser?.isDeactivated) {
            // throw new Error('This account has been deactivated.')
            throw new APIError('FORBIDDEN', {
              message: 'This account has been deactivated.',
            })
          }
        }
      }
    }),
  },

  baseURL: process.env['BETTER_AUTH_URL'],
  trustedOrigins: [
    process.env['BETTER_AUTH_URL'],
    process.env['LAN_ORIGIN'],
    process.env.VERCEL_ENV === 'preview' ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean) as string[],

  emailAndPassword: {
    enabled: true,

    async sendResetPassword(data) {
      await sendEmail(
        data.user.email,
        'Password Reset',
        `Hello ${data.user.name}!
        Password reset requested. Click the link to reset your password.
        ${data.url}`,

        `<h1> Hello ${data.user.name}!</h1>
        <p>Password reset requested. Click the link to reset your password.</p>
        <a href="${data.url}"> Reset password </a>`,
      )
    },
  },
  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    async sendVerificationEmail(data) {
      // react email
      const html = await render(<EmailVerfication url={data.url} />)
      const text = toPlainText(html)

      await sendEmail(data.user.email, 'Verify your email', text, html)
    },
  },
  user: {
    additionalFields: {
      mobileNumber: {
        type: 'string',
        required: false,
        input: true, // lets the client send this value on update
      },
      address: {
        type: 'string',
        required: false,
        input: true,
      },
    },

    changeEmail: {
      enabled: true,
      async sendChangeEmailConfirmation({ user, newEmail, url, token }) {
        // sent to the OLD email to confirm the change
        await sendEmail(
          user.email,
          'Confirm your email change',
          `Click to confirm changing your email to ${newEmail}: ${url}`,
          `<h1>Confirm email change</h1><p>Click to confirm changing your email to ${newEmail}.</p><a href="${url}">Confirm</a>`,
        )
      },
    },

    deleteUser: {
      enabled: true,
    },
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
    nextCookies(),
  ],
})
