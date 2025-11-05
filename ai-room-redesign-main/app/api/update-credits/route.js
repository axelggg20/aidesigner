import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, creditsToAdd } = await req.json();

    if (!userId || !creditsToAdd) {
      return NextResponse.json(
        { error: "User ID and credits to add are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: user.credits + creditsToAdd
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update credits error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating credits" },
      { status: 500 }
    );
  }
}
