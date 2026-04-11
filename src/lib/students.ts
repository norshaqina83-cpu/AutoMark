'use server';

import { adminDb } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import { Student } from '../../database';

/**
 * Adds a new student to the Firestore collection.
 */
export async function createStudent(data: Omit<Student, 'id'>) {
  try {
    const docRef = await adminDb.collection('students').add({
      ...data,
      createdAt: new Date().toISOString(),
    });

    revalidatePath('/students');
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding student:', error);
    return { success: false, error: 'Failed to create student' };
  }
}

/**
 * Fetches all students for a specific class.
 */
export async function getStudentsByClass(className: string) {
  try {
    const snapshot = await adminDb
      .collection('students')
      .where('class', '==', className)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Student[];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}