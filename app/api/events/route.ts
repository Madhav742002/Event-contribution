import { db } from "@/lib/db";
import { events } from "@/configs/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allEvents = await db.select().from(events).orderBy(events.date);

    // Convert to plain objects to avoid serialization issues
    const eventsData = allEvents.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      createdBy: event.clerkId, // Or you might want to fetch the user's name here
      ticketPrice: event.ticketPrice,
      imageUrls: event.imageUrls,
      createdAt: event.createdAt,
      // Add status based on date comparison
      status: new Date(`${event.date}T${event.time}`) < new Date() ? "ended" : "active"
    }));

    return NextResponse.json(eventsData);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming data
    if (!body.title || !body.date || !body.time || !body.location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert the new event into the database
    const newEvent = await db.insert(events).values({
      title: body.title,
      description: body.description || "",
      date: body.date, // Keep as string
      time: body.time,
      location: body.location,
      ticketPrice: body.ticketPrice || "0", // Ensure ticketPrice is a string
      imageUrls: body.imageUrls || [],
      clerkId: body.clerkId, // Add clerkId
      createdAt: new Date(),
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