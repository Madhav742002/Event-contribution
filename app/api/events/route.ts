import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { events } from "@/configs/schema";
import { eq } from "drizzle-orm";

// GET all events
export async function GET() {
  try {
    const allEvents = await db.select().from(events);
    return NextResponse.json(allEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST new event
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received event data:", body);

    // Validate required fields
    if (!body.title || !body.description || !body.date || !body.time || !body.location || !body.createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new event
    const newEvent = await db.insert(events).values({
      title: body.title,
      description: body.description,
      date: body.date,
      time: body.time,
      location: body.location,
      ticketPrice: body.ticketPrice || null,
      imageUrls: body.imageUrls || [],
      createdBy: body.createdBy,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Event created successfully", event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    await db.delete(events).where(eq(events.id, parseInt(id)));
    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
} 
// PUT (update) event
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const updatedEvent = await db.update(events)
      .set({
        title: body.title,
        description: body.description,
        date: body.date,
        time: body.time,
        location: body.location,
        ticketPrice: body.ticketPrice || null,
        imageUrls: body.imageUrls || [],
      })
      .where(eq(events.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      { message: "Event updated successfully", event: updatedEvent[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}