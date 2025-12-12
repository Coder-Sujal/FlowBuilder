import { betterAuth } from "better-auth";

import prisma from "@/lib/db";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { polar, checkout, portal, usage } from "@polar-sh/better-auth";
import { polarClient } from "./polar";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "5fdc5149-d3a5-49f0-ba0c-1df5b8e89b9d",
              slug: "Flowbuilder", // Custom slug for easy reference in Checkout URL, e.g. /checkout/Flowbuilder-pro
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
      ],
    }),
  ],
});
