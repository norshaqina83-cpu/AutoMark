import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Mark {
  id: string;
  userId: string;
  content: string;
  createdAt: Timestamp;
}