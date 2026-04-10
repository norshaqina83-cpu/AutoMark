import { NextRequest, NextResponse } from "next/server";
import { students } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const fingerprintId = searchParams.get("fingerprintId");

  let result = [...students];

  if (status === "active" || status === "inactive") {
    result = result.filter((s) => s.fingerprintStatus === status);
  }

  if (fingerprintId) {
    result = result.filter((s) => s.fingerprintId === fingerprintId);
  }

  return NextResponse.json({
    success: true,
    count: result.length,
    cards: result.map((s) => ({
      studentId: s.studentId,
      studentName: s.name,
      class: s.class,
      fingerprintId: s.fingerprintId,
      fingerprintStatus: s.fingerprintStatus,
    })),
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { fingerprintId, action } = body;

    if (!fingerprintId || !action) {
      return NextResponse.json(
        { success: false, error: "fingerprintId and action are required" },
        { status: 400 }
      );
    }

    if (action !== "activate" && action !== "deactivate") {
      return NextResponse.json(
        { success: false, error: "action must be 'activate' or 'deactivate'" },
        { status: 400 }
      );
    }

    const studentIndex = students.findIndex((s) => s.fingerprintId === fingerprintId);

    if (studentIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Fingerprint not found" },
        { status: 404 }
      );
    }

    const newStatus = action === "activate" ? "active" : "inactive";
    students[studentIndex] = {
      ...students[studentIndex],
      fingerprintStatus: newStatus,
    };

    return NextResponse.json({
      success: true,
      message: `Fingerprint ${action}d successfully`,
      card: {
        studentId: students[studentIndex].studentId,
        studentName: students[studentIndex].name,
        fingerprintId,
        fingerprintStatus: newStatus,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, fingerprintId } = body;

    if (!studentId || !fingerprintId) {
      return NextResponse.json(
        { success: false, error: "studentId and fingerprintId are required" },
        { status: 400 }
      );
    }

    const existingCard = students.find((s) => s.fingerprintId === fingerprintId);
    if (existingCard) {
      return NextResponse.json(
        {
          success: false,
          error: `Fingerprint ${fingerprintId} is already assigned to ${existingCard.name}`,
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

    students[studentIndex] = {
      ...students[studentIndex],
      fingerprintId,
      fingerprintStatus: "active",
    };

    return NextResponse.json({
      success: true,
      message: `New fingerprint enrolled for ${students[studentIndex].name}`,
      card: {
        studentId,
        studentName: students[studentIndex].name,
        fingerprintId,
        fingerprintStatus: "active",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}