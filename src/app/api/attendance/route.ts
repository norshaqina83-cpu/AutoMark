import { NextRequest, NextResponse } from "next/server";
import { attendanceRecords, attendanceSettings, students } from "@/lib/data";

/** Compare two "HH:MM" time strings. Returns negative if a < b, 0 if equal, positive if a > b */
function compareTime(a: string, b: string): number {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return ah * 60 + am - (bh * 60 + bm);
}

/** Determine attendance status based on configurable cutoff times */
function determineStatus(time: string): "present" | "late" | "absent" {
  // After absentAfter → absent
  if (compareTime(time, attendanceSettings.absentAfter) > 0) return "absent";
  // After lateAfter → late
  if (compareTime(time, attendanceSettings.lateAfter) > 0) return "late";
  return "present";
}

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
    settings: attendanceSettings,
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
    const time = now.toTimeString().slice(0, 5); // "HH:MM"

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

    // Determine status using configurable cutoff times
    const status = determineStatus(time);

    const newRecord = {
      id: `a${Date.now()}`,
      studentId: student.studentId,
      studentName: student.name,
      class: student.class,
      date,
      time,
      status,
      rfidTag,
    };

    attendanceRecords.push(newRecord);

    return NextResponse.json({
      success: true,
      message: `Attendance recorded for ${student.name}`,
      record: newRecord,
      status,
      settings: {
        lateAfter: attendanceSettings.lateAfter,
        absentAfter: attendanceSettings.absentAfter,
      },
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

// PATCH /api/attendance — Correct an attendance record (teacher/admin) or add absence reason (parent)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, correctedBy, absentReason, teacherNote } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
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

    const updates: Partial<typeof attendanceRecords[0]> = {};

    // Status update (teacher/admin only)
    if (status !== undefined) {
      const validStatuses = ["present", "absent", "late"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: "Invalid status. Must be present, absent, or late." },
          { status: 400 }
        );
      }
      updates.status = status;
      updates.correctedBy = correctedBy || "Teacher";
    }

    // Absence reason (parent)
    if (absentReason !== undefined) {
      updates.absentReason = absentReason;
    }

    // Teacher note (teacher/admin)
    if (teacherNote !== undefined) {
      updates.teacherNote = teacherNote;
    }

    attendanceRecords[recordIndex] = {
      ...attendanceRecords[recordIndex],
      ...updates,
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

// PATCH /api/attendance/settings — Update time thresholds (admin only)
// This is handled via a separate settings endpoint below
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { lateAfter, absentAfter } = body;

    if (!lateAfter || !absentAfter) {
      return NextResponse.json(
        { success: false, error: "lateAfter and absentAfter are required" },
        { status: 400 }
      );
    }

    // Validate time format HH:MM
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(lateAfter) || !timeRegex.test(absentAfter)) {
      return NextResponse.json(
        { success: false, error: "Times must be in HH:MM format" },
        { status: 400 }
      );
    }

    if (compareTime(lateAfter, absentAfter) >= 0) {
      return NextResponse.json(
        { success: false, error: "lateAfter must be earlier than absentAfter" },
        { status: 400 }
      );
    }

    attendanceSettings.lateAfter = lateAfter;
    attendanceSettings.absentAfter = absentAfter;

    return NextResponse.json({
      success: true,
      message: "Attendance time settings updated",
      settings: attendanceSettings,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
