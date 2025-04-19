import { db } from "@/configs/db";  // No need for .js extension in Next.js imports
import { feedback } from "@/configs/schema";  // Adjust import path accordingly
import { NextResponse } from "next/server";  // Use Next.js' server response

export async function POST(req: Request) {
  try {
    const { email, message, } = await req.json();  // Parse JSON from the request

    if (!email || !message) {
      return NextResponse.json({ error: "Email and message are required." }, { status: 400 });
    }

    // Insert data into the database using your schema
    await db.insert(feedback).values({ email, message });

    return NextResponse.json({ message: "Message submitted successfully!" });
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
