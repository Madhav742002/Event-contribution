import { db } from "@/lib/db";
import { events } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userEvents = await db
      .select()
      .from(events)
      .where(eq(events.clerkId, userId))
      .orderBy(events.createdAt); // Optional: latest events first

    return Response.json({ success: true, events: userEvents });
  } catch (error) {
    console.error("Error fetching user events:", error);
    return new Response("Failed to fetch events", { status: 500 });
  }
}
