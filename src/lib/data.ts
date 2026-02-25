// Mock data store for the RFID Attendance System
// In production, this would be replaced with a real database

export type Student = {
  id: string;
  name: string;
  studentId: string;
  class: string;
  rfidTag: string;
  rfidStatus: "active" | "inactive";
  parentEmail: string;
  parentName: string;
};

export type AttendanceRecord = {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  time: string;
  status: "present" | "absent" | "late";
  rfidTag: string;
  correctedBy?: string;
  /** Reason for absence submitted by parent */
  absentReason?: string;
  /** Internal note added by teacher/admin */
  teacherNote?: string;
};

/**
 * Configurable attendance time thresholds.
 * - Scans at or before `lateAfter` → Present
 * - Scans after `lateAfter` and at or before `absentAfter` → Late
 * - Scans after `absentAfter` OR no scan → Absent
 * Times are stored as "HH:MM" (24-hour).
 */
export type AttendanceSettings = {
  /** Scans after this time are marked Late (default: "07:00") */
  lateAfter: string;
  /** Scans after this time are marked Absent (default: "12:30") */
  absentAfter: string;
};

export const attendanceSettings: AttendanceSettings = {
  lateAfter: "07:00",
  absentAfter: "12:30",
};

export const students: Student[] = [
  {
    id: "s1",
    name: "Alice Johnson",
    studentId: "STU001",
    class: "10A",
    rfidTag: "RFID-A1B2C3",
    rfidStatus: "active",
    parentEmail: "parent.alice@email.com",
    parentName: "Mr. Johnson",
  },
  {
    id: "s2",
    name: "Bob Smith",
    studentId: "STU002",
    class: "10A",
    rfidTag: "RFID-D4E5F6",
    rfidStatus: "active",
    parentEmail: "parent.bob@email.com",
    parentName: "Mrs. Smith",
  },
  {
    id: "s3",
    name: "Carol White",
    studentId: "STU003",
    class: "10B",
    rfidTag: "RFID-G7H8I9",
    rfidStatus: "inactive",
    parentEmail: "parent.carol@email.com",
    parentName: "Mr. White",
  },
  {
    id: "s4",
    name: "David Brown",
    studentId: "STU004",
    class: "10B",
    rfidTag: "RFID-J1K2L3",
    rfidStatus: "active",
    parentEmail: "parent.david@email.com",
    parentName: "Mrs. Brown",
  },
  {
    id: "s5",
    name: "Emma Davis",
    studentId: "STU005",
    class: "10A",
    rfidTag: "RFID-M4N5O6",
    rfidStatus: "active",
    parentEmail: "parent.emma@email.com",
    parentName: "Mr. Davis",
  },
  {
    id: "s6",
    name: "Frank Wilson",
    studentId: "STU006",
    class: "10C",
    rfidTag: "RFID-P7Q8R9",
    rfidStatus: "active",
    parentEmail: "parent.frank@email.com",
    parentName: "Mrs. Wilson",
  },
];

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: "a1",
    studentId: "STU001",
    studentName: "Alice Johnson",
    class: "10A",
    date: "2026-02-25",
    time: "06:55",
    status: "present",
    rfidTag: "RFID-A1B2C3",
  },
  {
    id: "a2",
    studentId: "STU002",
    studentName: "Bob Smith",
    class: "10A",
    date: "2026-02-25",
    time: "08:15",
    status: "late",
    rfidTag: "RFID-D4E5F6",
  },
  {
    id: "a3",
    studentId: "STU005",
    studentName: "Emma Davis",
    class: "10A",
    date: "2026-02-25",
    time: "",
    status: "absent",
    rfidTag: "RFID-M4N5O6",
    absentReason: "Sick with fever — will return tomorrow.",
  },
  {
    id: "a4",
    studentId: "STU004",
    studentName: "David Brown",
    class: "10B",
    date: "2026-02-25",
    time: "06:58",
    status: "present",
    rfidTag: "RFID-J1K2L3",
  },
  {
    id: "a5",
    studentId: "STU001",
    studentName: "Alice Johnson",
    class: "10A",
    date: "2026-02-24",
    time: "07:01",
    status: "present",
    rfidTag: "RFID-A1B2C3",
  },
  {
    id: "a6",
    studentId: "STU002",
    studentName: "Bob Smith",
    class: "10A",
    date: "2026-02-24",
    time: "",
    status: "absent",
    rfidTag: "RFID-D4E5F6",
    absentReason: "Family emergency.",
    teacherNote: "Parent called in advance.",
  },
  {
    id: "a7",
    studentId: "STU005",
    studentName: "Emma Davis",
    class: "10A",
    date: "2026-02-24",
    time: "07:05",
    status: "present",
    rfidTag: "RFID-M4N5O6",
  },
  {
    id: "a8",
    studentId: "STU006",
    studentName: "Frank Wilson",
    class: "10C",
    date: "2026-02-25",
    time: "07:00",
    status: "present",
    rfidTag: "RFID-P7Q8R9",
  },
];

export const classes = ["10A", "10B", "10C"];
