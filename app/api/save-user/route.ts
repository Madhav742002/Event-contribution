// app/api/save-user/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // your drizzle db connection
import { users } from "@/configs/schema";
import { auth } from "@clerk/nextjs/server"; // Clerk authentication

export async function POST(req: NextRequest) {
  const { userId } = await auth(); // Clerk User ID

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, imageUrl } = await req.json();

    // Insert user into DB
    await db.insert(users).values({
      clerkId: userId,
      name,
      email,
      imageUrl,
    }).onConflictDoNothing(); // optional: ignore if user already exists

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[SAVE_USER_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
