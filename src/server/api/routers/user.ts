import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { users, userRole } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  updateRole: protectedProcedure
    .input(z.object({ role: z.enum(userRole.enumValues) }))
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("Starting updateRole mutation for user:", ctx.auth.userId);
        
        // First, check if user exists in our database
        console.log("Checking if user exists in database");
        let existingUser;
        try {
          existingUser = await ctx.db.query.users.findFirst({
            where: (users, { eq }) => eq(users.clerkId, ctx.auth.userId),
          });
          console.log("Existing user lookup result:", existingUser);
        } catch (dbError) {
          console.error("Database query error:", dbError);
          throw new Error(`Database query failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
        }

        // If user doesn't exist, create them first
        if (!existingUser) {
          console.log("User not found in database, creating new user");
          try {
            console.log("Fetching user from Clerk");
            const clerk = await clerkClient();
            const clerkUser = await clerk.users.getUser(ctx.auth.userId);
            console.log("Retrieved Clerk user data:", clerkUser);
            
            console.log("Inserting user into database");
            await ctx.db.insert(users).values({
              clerkId: ctx.auth.userId,
              email: clerkUser.emailAddresses[0]?.emailAddress ?? `${ctx.auth.userId}@no-email.example`,

              name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim() : undefined,
              role: input.role,
            });
            console.log("Created new user in database");
          } catch (clerkError) {
            console.error("Error retrieving user from Clerk:", clerkError);
            // Even if we can't get detailed info from Clerk, we still want to create the user
            console.log("Inserting user into database with minimal info");
            await ctx.db.insert(users).values({
              clerkId: ctx.auth.userId,
              email: `${ctx.auth.userId}@no-email.example`,

              name: undefined,
              role: input.role,
            });
            console.log("Created new user in database with minimal info");
          }
        } else {
          // If user exists, just update their role
          console.log("User found in database, updating role");
          try {
            await ctx.db
              .update(users)
              .set({ role: input.role })
              .where(eq(users.clerkId, ctx.auth.userId));
            console.log("Updated user role in database");
          } catch (dbError) {
            console.error("Database update error:", dbError);
            throw new Error(`Database update failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
          }
        }

        // Update Clerk metadata
        console.log("Updating Clerk metadata");
        try {
          const clerk = await clerkClient();
          await clerk.users.updateUser(ctx.auth.userId, {
            publicMetadata: { role: input.role },
          });
          console.log("Updated Clerk metadata");
        } catch (clerkError) {
          console.error("Error updating Clerk metadata:", clerkError);
          // We don't want to fail the whole operation if we can't update Clerk metadata
        }

        console.log("updateRole mutation completed successfully");
        return { success: true };
      } catch (error) {
        console.error("Error updating user role:", error);
        // Return a more detailed error for debugging
        if (error instanceof Error) {
          throw new Error(`Failed to update user role: ${error.message}`);
        }
        throw new Error("Failed to update user role: Unknown error");
      }
    }),
});
