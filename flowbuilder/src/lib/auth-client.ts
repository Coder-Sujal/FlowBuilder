import { createAuthClient } from "better-auth/react";
import { polarClient } from "@polar-sh/better-auth";

// This is all that is needed
// All Polar plugins, etc. should be attached to the server-side BetterAuth config
export const authClient = createAuthClient({
  plugins: [polarClient()],
});