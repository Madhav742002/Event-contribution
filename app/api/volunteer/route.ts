import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { volunteers } from "@/configs/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if the volunteer already exists (by email & ID)
    const existingVolunteer = await db
      .select()
      .from(volunteers)
      .where(
        and(eq(volunteers.email, body.email), eq(volunteers.id, body.id))
      );

    if (existingVolunteer.length > 0) {
      console.log("Volunteer already exists:", existingVolunteer[0]);
      return NextResponse.json(
        { message: "Volunteer already exists!", volunteer: existingVolunteer[0] },
        { status: 200 }
      );
    }

    // Insert new volunteer
    await db.insert(volunteers).values({
      name: body.name,
      email: body.email,
      id: body.id,
      post: body.post,
    });

    console.log("New Volunteer Registered:", body);
    return NextResponse.json({ message: "Volunteer registered successfully!" }, { status: 201 });

  } catch (error) {
    console.error("Error inserting volunteer:", error);
    return NextResponse.json({ error: "Error registering volunteer" }, { status: 500 });
  }
}
