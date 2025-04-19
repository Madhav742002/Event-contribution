// app/api/addMember/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // do something with the body, like save to DB
  console.log("New member data:", body);

  return NextResponse.json({ success: true, message: "Member added!" });
}
