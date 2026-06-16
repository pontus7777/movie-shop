import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import "dotenv/config";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, user } from "@/lib/permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: process.env["BETTER_AUTH_URL"],
  emailAndPassword: { enabled: true },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
        // myCustomRole
      },
    }),
  ],
});
