import { User } from "@/lib/auth";

export type Student = {
  id: string;
  name: string;
  studentId: string;
  class: string;
  fingerprintId: string;
  fingerprintStatus: "active" | "inactive";
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
  fingerprintId: string;
  correctedBy?: string;
  absentReason?: string;
  teacherNote?: string;
  truancyNotified?: boolean;
};

export type RewardClaim = {
  id: string;
  studentId: string;
  streakAtClaim: number;
  claimedAt: string;
  rewardReceived: boolean;
  receivedAt?: string;
  teacherNote?: string;
};

export type ParentNotification = {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type AttendanceSettings = {
  lateAfter: string;
  absentAfter: string;
};

const STORAGE_KEYS = {
  students: "automark_students",
  attendance: "automark_attendance",
  rewards: "automark_rewards",
  notifications: "automark_notifications",
  settings: "automark_settings",
};

export const attendanceSettings: AttendanceSettings = {
  lateAfter: "07:00",
  absentAfter: "12:30",
};

export const classes = ["10A", "10B", "10C", "11A", "11B", "12A", "12B"];

export function getStoredStudents(): Student[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.students);
  return stored ? JSON.parse(stored) : [];
}

export function saveStudents(students: Student[]) {
  localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(students));
}

export function getStoredAttendance(): AttendanceRecord[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.attendance);
  return stored ? JSON.parse(stored) : [];
}

export function saveAttendance(records: AttendanceRecord[]) {
  localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(records));
}

export function getStoredRewards(): RewardClaim[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.rewards);
  return stored ? JSON.parse(stored) : [];
}

export function saveRewards(rewards: RewardClaim[]) {
  localStorage.setItem(STORAGE_KEYS.rewards, JSON.stringify(rewards));
}

export function getStoredNotifications(): ParentNotification[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.notifications);
  return stored ? JSON.parse(stored) : [];
}

export function saveNotifications(notifications: ParentNotification[]) {
  localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
}

export function getStoredSettings(): AttendanceSettings | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.settings);
  return stored ? JSON.parse(stored) : null;
}

export function saveSettings(settings: AttendanceSettings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export const students: Student[] = [];
export const attendanceRecords: AttendanceRecord[] = [];
export const rewardClaims: RewardClaim[] = [];
export const parentNotifications: ParentNotification[] = [];
