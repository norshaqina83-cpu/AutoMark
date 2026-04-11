/**
 * Shared interface for Firebase Timestamps across Client and Admin SDKs.
 */
export type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export interface Mark {
  id: string;
  userId: string;
  content: string;
  createdAt: FirestoreTimestamp;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  class: string;
  fingerprintId: string;
  fingerprintStatus: "active" | "inactive";
  parentEmail: string;
  parentName: string;
  createdAt?: string | FirestoreTimestamp;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  time: string;
  status: "present" | "absent" | "late";
  fingerprintId: string;
  createdAt: FirestoreTimestamp;
}

export interface RewardClaim {
  id: string;
  studentId: string;
  streakAtClaim: number;
  claimedAt: string;
  rewardReceived: boolean;
  receivedAt?: string;
  teacherNote?: string;
}

export interface ParentNotification {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  message: string;
  read: boolean;
  createdAt: string;
}