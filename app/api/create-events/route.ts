import { db } from "@/lib/db"; // your database connection
import { events } from "@/configs/schema"; // your Drizzle ORM schema
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server"; // Import Clerk auth
import { NextResponse } from "next/server";



export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.date || !body.time || !body.location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEvent = await db.insert(events).values({
      clerkId: userId,
      title: body.title,
      description: body.description || "",
      date: body.date,
      time: body.time,
      location: body.location,
      ticketPrice: body.ticketPrice || "0",
      imageUrls: body.imageUrls || [],
    }).returning();

    return NextResponse.json({ success: true, event: newEvent[0] });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}