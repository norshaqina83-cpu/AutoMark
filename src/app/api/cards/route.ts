import { NextRequest, NextResponse } from "next/server";
import { students } from "@/lib/data";

// GET /api/cards — List all RFID cards
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const rfidTag = searchParams.get("rfidTag");

  let result = [...students];

  if (status === "active" || status === "inactive") {
    result = result.filter((s) => s.rfidStatus === status);
  }

  if (rfidTag) {
    result = result.filter((s) => s.rfidTag === rfidTag);
  }

  return NextResponse.json({
    success: true,
    count: result.length,
    cards: result.map((s) => ({
      studentId: s.studentId,
      studentName: s.name,
      class: s.class,
      rfidTag: s.rfidTag,
      rfidStatus: s.rfidStatus,
    })),
  });
}

// PATCH /api/cards — Activate or deactivate a card
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { rfidTag, action } = body;

    if (!rfidTag || !action) {
      return NextResponse.json(
        { success: false, error: "rfidTag and action are required" },
        { status: 400 }
      );
    }

    if (action !== "activate" && action !== "deactivate") {
      return NextResponse.json(
        { success: false, error: "action must be 'activate' or 'deactivate'" },
        { status: 400 }
      );
    }

    const studentIndex = students.findIndex((s) => s.rfidTag === rfidTag);

    if (studentIndex === -1) {
      return NextResponse.json(
        { success: false, error: "RFID tag not found" },
        { status: 404 }
      );
    }

    const newStatus = action === "activate" ? "active" : "inactive";
    students[studentIndex] = {
      ...students[studentIndex],
      rfidStatus: newStatus,
    };

    return NextResponse.json({
      success: true,
      message: `Card ${action}d successfully`,
      card: {
        studentId: students[studentIndex].studentId,
        studentName: students[studentIndex].name,
        rfidTag,
        rfidStatus: newStatus,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// POST /api/cards — Register a new RFID card for a student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, rfidTag } = body;

    if (!studentId || !rfidTag) {
      return NextResponse.json(
        { success: false, error: "studentId and rfidTag are required" },
        { status: 400 }
      );
    }

    // Check if RFID tag is already in use
    const existingCard = students.find((s) => s.rfidTag === rfidTag);
    if (existingCard) {
      return NextResponse.json(
        {
          success: false,
          error: `RFID tag ${rfidTag} is already assigned to ${existingCard.name}`,
        },
        { status: 409 }
      );
    }

    const studentIndex = students.findIndex((s) => s.studentId === studentId);
    if (studentIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    // Assign new RFID tag and activate
    students[studentIndex] = {
      ...students[studentIndex],
      rfidTag,
      rfidStatus: "active",
    };

    return NextResponse.json({
      success: true,
      message: `New RFID card assigned to ${students[studentIndex].name}`,
      card: {
        studentId,
        studentName: students[studentIndex].name,
        rfidTag,
        rfidStatus: "active",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
