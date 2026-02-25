import { NextRequest, NextResponse } from "next/server";
import { attendanceRecords, students } from "@/lib/data";

// GET /api/attendance?class=10A&date=2026-02-25
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const classFilter = searchParams.get("class");
  const dateFilter = searchParams.get("date");
  const studentId = searchParams.get("studentId");

  let records = [...attendanceRecords];

  if (classFilter) {
    records = records.filter((r) => r.class === classFilter);
  }
  if (dateFilter) {
    records = records.filter((r) => r.date === dateFilter);
  }
  if (studentId) {
    records = records.filter((r) => r.studentId === studentId);
  }

  return NextResponse.json({
    success: true,
    count: records.length,
    records,
  });
}

// POST /api/attendance — Record a new RFID scan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rfidTag } = body;

    if (!rfidTag) {
      return NextResponse.json(
        { success: false, error: "rfidTag is required" },
        { status: 400 }
      );
    }

    // Find student by RFID tag
    const student = students.find((s) => s.rfidTag === rfidTag);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: "Unknown RFID tag",
          led: "red",
          buzzer: false,
        },
        { status: 404 }
      );
    }

    if (student.rfidStatus === "inactive") {
      return NextResponse.json(
        {
          success: false,
          error: "Card is deactivated. Please contact administration.",
          studentName: student.name,
          led: "red",
          buzzer: false,
        },
        { status: 403 }
      );
    }

    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);

    // Check if already scanned today
    const existingRecord = attendanceRecords.find(
      (r) => r.studentId === student.studentId && r.date === date
    );

    if (existingRecord) {
      return NextResponse.json({
        success: false,
        error: "Already scanned today",
        studentName: student.name,
        existingRecord,
        led: "yellow",
        buzzer: false,
      });
    }

    // Determine status: late if after 08:10
    const [hours, minutes] = time.split(":").map(Number);
    const isLate = hours > 8 || (hours === 8 && minutes > 10);

    const newRecord = {
      id: `a${Date.now()}`,
      studentId: student.studentId,
      studentName: student.name,
      class: student.class,
      date,
      time,
      status: isLate ? ("late" as const) : ("present" as const),
      rfidTag,
    };

    attendanceRecords.push(newRecord);

    return NextResponse.json({
      success: true,
      message: `Attendance recorded for ${student.name}`,
      record: newRecord,
      led: "green",
      buzzer: true,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// PATCH /api/attendance — Correct an attendance record (teacher only)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, correctedBy } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "id and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["present", "absent", "late"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status. Must be present, absent, or late." },
        { status: 400 }
      );
    }

    const recordIndex = attendanceRecords.findIndex((r) => r.id === id);
    if (recordIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    attendanceRecords[recordIndex] = {
      ...attendanceRecords[recordIndex],
      status,
      correctedBy: correctedBy || "Teacher",
    };

    return NextResponse.json({
      success: true,
      message: "Attendance record updated",
      record: attendanceRecords[recordIndex],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
