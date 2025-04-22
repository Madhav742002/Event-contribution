// app/api/revenue/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paymentDetails } from "@/configs/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.execute(
      sql`SELECT SUM(amount)::numeric::float8 as total FROM ${paymentDetails}`
    );

    const totalRevenue = result[0]?.total || 0;

    return NextResponse.json({ success: true, totalRevenue });
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch revenue" }, { status: 500 });
  }
}
