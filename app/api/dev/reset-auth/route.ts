import { NextResponse } from "next/server";
import { resetDevAuth } from "@/lib/auth/reset-dev-auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    const result = await resetDevAuth();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error resetting auth:", error);
    return NextResponse.json(
      { error: "Failed to reset auth" },
      { status: 500 }
    );
  }
}
