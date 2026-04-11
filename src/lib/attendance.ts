'use server';

import { adminDb } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { AttendanceRecord } from '../../database';

/**
 * Records an attendance entry for a student.
 */
export async function logAttendance(data: Omit<AttendanceRecord, 'id' | 'createdAt'>) {
  try {
    const attendanceData = {
      ...data,
      createdAt: Timestamp.now(),
    };

    // Save to the 'attendance' collection
    const docRef = await adminDb.collection('attendance').add(attendanceData);

    // Revalidate paths to update the UI
    revalidatePath('/attendance');
    revalidatePath('/dashboard');

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error logging attendance:', error);
    return { success: false, error: 'Failed to log attendance' };
  }
}

/**
 * Fetches attendance records for a specific date.
 */
export async function getAttendanceByDate(date: string) {
  try {
    const snapshot = await adminDb.collection('attendance').where('date', '==', date).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AttendanceRecord[];
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
}