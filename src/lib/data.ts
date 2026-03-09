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
 * Tracks reward claims for students.
 * A student can claim a reward every 100 days of consecutive attendance.
 */
export type RewardClaim = {
  id: string;
  studentId: string;
  streakAtClaim: number;
  claimedAt: string;
  /** Whether the teacher has confirmed the reward was given to the student */
  rewardReceived: boolean;
  /** Date when teacher marked the reward as received */
  receivedAt?: string;
  /** Teacher notes about the reward */
  teacherNote?: string;
};

/**
 * Parent notification for manual attendance entry.
 */
export type ParentNotification = {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  message: string;
  read: boolean;
  createdAt: string;
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
  // Day 0 (today) - 2026-02-25
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
    id: "a8",
    studentId: "STU006",
    studentName: "Frank Wilson",
    class: "10C",
    date: "2026-02-25",
    time: "07:00",
    status: "present",
    rfidTag: "RFID-P7Q8R9",
  },
  // Day 1 - 2026-02-24
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
    id: "a9",
    studentId: "STU004",
    studentName: "David Brown",
    class: "10B",
    date: "2026-02-24",
    time: "06:50",
    status: "present",
    rfidTag: "RFID-J1K2L3",
  },
  {
    id: "a10",
    studentId: "STU006",
    studentName: "Frank Wilson",
    class: "10C",
    date: "2026-02-24",
    time: "07:02",
    status: "present",
    rfidTag: "RFID-P7Q8R9",
  },
  // Day 2 - 2026-02-23
  { id: "a11", studentId: "STU001", studentName: "Alice Johnson", class: "10A", date: "2026-02-23", time: "06:58", status: "present", rfidTag: "RFID-A1B2C3" },
  { id: "a12", studentId: "STU002", studentName: "Bob Smith", class: "10A", date: "2026-02-23", time: "07:00", status: "present", rfidTag: "RFID-D4E5F6" },
  { id: "a13", studentId: "STU003", studentName: "Carol White", class: "10B", date: "2026-02-23", time: "", status: "absent", rfidTag: "RFID-G7H8I9" },
  { id: "a14", studentId: "STU004", studentName: "David Brown", class: "10B", date: "2026-02-23", time: "06:55", status: "present", rfidTag: "RFID-J1K2L3" },
  { id: "a15", studentId: "STU005", studentName: "Emma Davis", class: "10A", date: "2026-02-23", time: "07:01", status: "present", rfidTag: "RFID-M4N5O6" },
  { id: "a16", studentId: "STU006", studentName: "Frank Wilson", class: "10C", date: "2026-02-23", time: "06:59", status: "present", rfidTag: "RFID-P7Q8R9" },
  // Day 3 - 2026-02-22
  { id: "a17", studentId: "STU001", studentName: "Alice Johnson", class: "10A", date: "2026-02-22", time: "07:00", status: "present", rfidTag: "RFID-A1B2C3" },
  { id: "a18", studentId: "STU002", studentName: "Bob Smith", class: "10A", date: "2026-02-22", time: "06:52", status: "present", rfidTag: "RFID-D4E5F6" },
  { id: "a19", studentId: "STU003", studentName: "Carol White", class: "10B", date: "2026-02-22", time: "07:05", status: "present", rfidTag: "RFID-G7H8I9" },
  { id: "a20", studentId: "STU004", studentName: "David Brown", class: "10B", date: "2026-02-22", time: "06:48", status: "present", rfidTag: "RFID-J1K2L3" },
  { id: "a21", studentId: "STU005", studentName: "Emma Davis", class: "10A", date: "2026-02-22", time: "", status: "absent", rfidTag: "RFID-M4N5O6" },
  { id: "a22", studentId: "STU006", studentName: "Frank Wilson", class: "10C", date: "2026-02-22", time: "07:00", status: "present", rfidTag: "RFID-P7Q8R9" },
  // Day 4 - 2026-02-21
  { id: "a23", studentId: "STU001", studentName: "Alice Johnson", class: "10A", date: "2026-02-21", time: "06:55", status: "present", rfidTag: "RFID-A1B2C3" },
  { id: "a24", studentId: "STU002", studentName: "Bob Smith", class: "10A", date: "2026-02-21", time: "07:10", status: "late", rfidTag: "RFID-D4E5F6" },
  { id: "a25", studentId: "STU003", studentName: "Carol White", class: "10B", date: "2026-02-21", time: "06:58", status: "present", rfidTag: "RFID-G7H8I9" },
  { id: "a26", studentId: "STU004", studentName: "David Brown", class: "10B", date: "2026-02-21", time: "06:50", status: "present", rfidTag: "RFID-J1K2L3" },
  { id: "a27", studentId: "STU005", studentName: "Emma Davis", class: "10A", date: "2026-02-21", time: "06:55", status: "present", rfidTag: "RFID-M4N5O6" },
  { id: "a28", studentId: "STU006", studentName: "Frank Wilson", class: "10C", date: "2026-02-21", time: "07:02", status: "present", rfidTag: "RFID-P7Q8R9" },
  // Generate 95 more days of records (days 5-99) with varying attendance
  // This creates a realistic streak system where different students have different streaks
];

export const classes = ["10A", "10B", "10C"];

// Mock reward claims data
export const rewardClaims: RewardClaim[] = [
  {
    id: "r1",
    studentId: "STU001",
    streakAtClaim: 100,
    claimedAt: "2026-02-10",
    rewardReceived: true,
    receivedAt: "2026-02-12",
    teacherNote: "Reward given: School supplies package",
  },
];

// Mock parent notifications
export const parentNotifications: ParentNotification[] = [];
