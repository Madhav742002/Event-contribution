import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { admins, users } from "@/configs/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received registration request:", body);

    // Validate required fields
    if (!body.role || !body.organizationName || !body.eventName || !body.name || !body.email || !body.gender) {
      console.log("Validation failed: Missing required fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Determine the correct table based on role
    const table = body.role === "admin" ? admins : users;
    console.log("Using table:", body.role === "admin" ? "admins" : "users");

    try {
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
        console.log("Event already exists");
        return NextResponse.json(
          { message: "Event already exists, opening instead!" },
          { status: 200 }
        );
      }

      // Insert new event
      const result = await db.insert(table).values({
        userId: body.userId,
        organizationName: body.organizationName,
        eventName: body.eventName,
        name: body.name,
        email: body.email,
        gender: body.gender,
      });

      console.log("Insert successful:", result);
      return NextResponse.json(
        { message: "Event registered successfully!" },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Database error occurred. Please try again." },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Server error occurred. Please try again." },
      { status: 500 }
    );
  }
}
