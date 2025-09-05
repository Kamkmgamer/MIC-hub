/* eslint-disable */
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { users, userRole } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    // Get the request body
    const body = await req.json();
    const { role } = body;

    // Validate the role
    if (!role || !userRole.enumValues.includes(role as any)) {
      return NextResponse.json(
        { error: "Invalid role provided" },
        { status: 400 }
      );
    }

    // Create a mock request object that mimics NextRequest
    const mockReq = {
      headers: req.headers,
    };

    // Get auth data using the correct Clerk middleware approach
    const authData = getAuth(mockReq as any);
    if (!authData.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user exists in our database
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.clerkId, authData.userId),
    });

    // If user doesn't exist, create them first
    if (!existingUser) {
      try {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(authData.userId);
        
        await db.insert(users).values({
          clerkId: authData.userId,
          email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
          name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim() : undefined,
          role: role as any,
        });
      } catch (clerkError) {
        // Even if we can't get detailed info from Clerk, we still want to create the user
        await db.insert(users).values({
          clerkId: authData.userId,
          email: "",
          name: undefined,
          role: role as any,
        });
      }
    } else {
      // If user exists, just update their role
      await db
        .update(users)
        .set({ role: role as any })
        .where(eq(users.clerkId, authData.userId));
    }

    // Update Clerk metadata
    try {
      const client = await clerkClient();
      await client.users.updateUser(authData.userId, {
        publicMetadata: { role },
      });
    } catch (clerkError) {
      // We don't want to fail the whole operation if we can't update Clerk metadata
      console.error("Error updating Clerk metadata:", clerkError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in onboarding API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}