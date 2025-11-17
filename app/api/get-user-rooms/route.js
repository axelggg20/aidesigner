import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const rooms = await prisma.aiGeneratedImage.findMany({
      where: { userId },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Get user rooms error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching rooms" },
      { status: 500 }
    );
  }
}
