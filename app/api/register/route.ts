import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { admins, users } from "@/configs/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Determine the correct table based on role
    const table = body.role === "admin" ? admins : users;

    // Check if the event already exists in the database
    const existingEvent = await db
      .select()
      .from(table)
      .where(
        and(
          eq(table.organizationName, body.organizationName),
          eq(table.eventName, body.eventName)
        )
      );

    if (existingEvent.length > 0) {
      console.log("Event already exists:", existingEvent);
      return NextResponse.json(
        { message: "Event already exists, opening instead!" },
        { status: 200 }
      );
    }

    // Insert new event
    await db.insert(table).values({
      userId: body.userId,
      organizationName: body.organizationName,
      eventName: body.eventName,
      name: body.name,
      email: body.email,
      gender: body.gender,
    });

    console.log(`Inserted into ${body.role === "admin" ? "Admins" : "Users"} Table:`, body);
    return NextResponse.json({ message: "Event registered successfully!" }, { status: 201 });

  } catch (error) {
    console.error("Error inserting event:", error);
    return NextResponse.json({ error: "Error registering event" }, { status: 500 });
  }
}
