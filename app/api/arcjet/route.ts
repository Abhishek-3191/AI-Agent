import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
import { isSpoofedBot } from "@arcjet/inspect";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { aj } from "@/config/Arcjet";
// Initialize Arcjet


export async function GET(req: Request) {
  // ❗ FIXED: userId MUST be defined
  // You can attach userId from cookies, session, header, or default to IP.
//   const userId = "anonymous-user"; // Replace with actual user ID when logged in
  const user = await currentUser();
  const userId = user?.id || "guest";
  const decision = await aj.protect(req, {
    userId,
    requested: 5, // Deduct 5 tokens
  });

  console.log("Arcjet decision", decision);

  // If Arcjet denied the request
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        { error: "Too Many Requests", reason: decision.reason },
        { status: 429 }
      );
    }

    if (decision.reason.isBot()) {
      return NextResponse.json(
        { error: "No bots allowed", reason: decision.reason },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Forbidden", reason: decision.reason },
      { status: 403 }
    );
  }

  // Hosting IP / proxy detection
  if (decision.ip.isHosting()) {
    return NextResponse.json(
      { error: "Hosting IP not allowed", reason: decision.reason },
      { status: 403 }
    );
  }

  // Spoofed bot detection
  if (decision.results.some(isSpoofedBot)) {
    return NextResponse.json(
      { error: "Spoofed bot blocked", reason: decision.reason },
      { status: 403 }
    );
  }

  // Success response
  return NextResponse.json({ message: "Hello world" }, { status: 200 });
}
