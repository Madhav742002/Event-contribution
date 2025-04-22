import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paymentDetails } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { event, studentDetails, paymentId, amount, razorpayOrderId, razorpaySignature } = await request.json();
    
    const paymentData = {
      eventId: event.id,
      eventTitle: event.title,
      studentName: studentDetails.name,
      studentEmail: studentDetails.Email,
      studentAddress: studentDetails.branch,
      studentMobile: studentDetails.program,
      enrollmentNo: studentDetails.enrollmentNo,
      paymentId,
      amount: amount.toString(),
      razorpayOrderId,
      razorpaySignature,
      status: "completed",
      ticketDownloaded: false
    };

    const result = await db.insert(paymentDetails).values(paymentData).returning();

    return NextResponse.json(
      { 
        success: true, 
        paymentId: result[0].id,
        message: "Payment details stored successfully"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error storing payment details:", error);
    return NextResponse.json(
      { 
        error: "Failed to store payment details",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    const enrollmentNo = searchParams.get('enrollmentNo');

    let whereClause;

    if (paymentId) {
      whereClause = eq(paymentDetails.paymentId, paymentId);
    } else if (enrollmentNo) {
      whereClause = eq(paymentDetails.enrollmentNo, enrollmentNo);
    }

    const query = whereClause
      ? db.select().from(paymentDetails).where(whereClause).orderBy(paymentDetails.createdAt)
      : db.select().from(paymentDetails).orderBy(paymentDetails.createdAt);

    const payments = await query;

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment details" },
      { status: 500 }
    );
  }
}
