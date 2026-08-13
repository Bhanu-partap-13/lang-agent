import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { userProfile, userStats } from "../db/schema";
import * as schema from "../db/schema";
import * as authSchema from "../db/auth-schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      ...schema,
      ...authSchema
    }
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const baseName = user.name ? user.name.split(" ")[0].toLowerCase() : "learner";

          // Retry up to 5 times on username collision
          let inserted = false;
          for (let attempt = 0; attempt < 5; attempt++) {
            const username = `${baseName}${Math.floor(Math.random() * 100000)}`;
            try {
              await db.insert(userProfile).values({
                userId: user.id,
                username,
              });
              inserted = true;
              break;
            } catch {
              // Likely unique constraint violation — retry with a new suffix
            }
          }

          if (!inserted) {
            // Last-resort fallback using a timestamp-based suffix
            const username = `${baseName}${Date.now()}`;
            await db.insert(userProfile).values({
              userId: user.id,
              username,
            });
          }

          await db.insert(userStats).values({
            userId: user.id,
          });
        },
      },
    },
  },
});
