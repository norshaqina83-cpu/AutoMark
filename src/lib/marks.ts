'use server';

import { adminDb } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

export async function createMark(userId: string, content: string) {
  if (!content || content.trim().length === 0) {
    throw new Error('Content cannot be empty');
  }

  try {
    const markData = {
      userId,
      content,
      createdAt: Timestamp.now(),
    };

    // Save to the 'marks' collection
    const docRef = await adminDb.collection('marks').add(markData);

    // Trigger a refresh of the UI
    revalidatePath('/dashboard');

    return { 
      success: true, 
      id: docRef.id 
    };
  } catch (error) {
    console.error('Error adding mark: ', error);
    return { success: false, error: 'Failed to create mark' };
  }
}