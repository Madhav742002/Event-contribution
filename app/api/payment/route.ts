import { db } from "@/configs/db";
import { payments, events } from "@/configs/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { eventId, studentName, studentEmail,  paymentId, amount } = body;

    if (!eventId || !studentName || !studentEmail || !paymentId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(payments).values({
      eventId,
      studentName,
      studentEmail,
      paymentId,
      amount,
    });

    return NextResponse.json({ message: "Payment record added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding payment record:", error);
    return NextResponse.json({ error: "Failed to add payment record" }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all events created by this user
    const userEvents = await db.select({ id: events.id })
      .from(events)
      .where(eq(events.clerkId, userId));

    if (userEvents.length === 0) {
      return NextResponse.json({ success: true, payments: [], total: 0 }, { status: 200 });
    }

    // Convert event IDs to strings since payments.eventId is text
    const eventIds = userEvents.map(event => event.id.toString());

    // Get all payments for these events using 'inArray' instead of multiple 'eq'
    const userPayments = await db.select()
      .from(payments)
      .where(inArray(payments.eventId, eventIds));

    // Calculate total amount
    const total = userPayments.reduce((sum, payment) => {
      return sum + (parseFloat(payment.amount) || 0);
    }, 0);

    return NextResponse.json({ 
      success: true, 
      payments: userPayments,
      total 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching payment records:", error);
    return NextResponse.json({ error: "Failed to fetch payment records" }, { status: 500 });
  }
}