import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, RankingUser } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with specific database ID if provided
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Error Handling conforming to Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on load
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testFirestoreConnection();

// Sign in with Google Popup
export const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    // If popup was blocked or closed by user, rethrow friendly error
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Ventana de inicio de sesión cerrada antes de completar.');
    }
    throw error;
  }
};

// Sign out
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Save / Sync User Profile to Firestore
export const saveUserProfileToFirestore = async (userProfile: UserProfile): Promise<void> => {
  if (!userProfile) return;
  const currentAuthUser = auth.currentUser;
  if (!currentAuthUser) {
    // Guest or unauthenticated users store state locally
    return;
  }

  const targetUid = currentAuthUser.uid;
  const pathForWrite = `users/${targetUid}`;
  try {
    const userRef = doc(db, 'users', targetUid);
    await setDoc(
      userRef,
      {
        ...userProfile,
        id: targetUid,
        email: currentAuthUser.email || userProfile.email,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error: any) {
    if (error?.message?.includes('insufficient permissions') || error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.WRITE, pathForWrite);
    } else {
      console.error('Error saving user profile to Firestore:', error);
      throw error;
    }
  }
};

// Load User Profile from Firestore
export const loadUserProfileFromFirestore = async (userId: string): Promise<UserProfile | null> => {
  if (!userId) return null;
  const pathForGet = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error: any) {
    if (error?.message?.includes('insufficient permissions') || error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.GET, pathForGet);
    } else {
      console.error('Error loading user profile from Firestore:', error);
      return null;
    }
  }
};

// Fetch top ranking from Firestore
export const fetchCloudRanking = async (): Promise<RankingUser[]> => {
  const pathForQuery = 'users';
  try {
    const usersRef = collection(db, pathForQuery);
    const q = query(usersRef, orderBy('xp', 'desc'), limit(20));
    const querySnapshot = await getDocs(q);
    const list: RankingUser[] = [];
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data() as UserProfile;
      list.push({
        id: data.id,
        name: data.name || 'Aficionado',
        instagram: data.instagram || '@sotoibarbaso',
        level: data.level || 1,
        xp: data.xp || 0,
        badgesCount: data.earnedBadges?.length || 0,
        avatarSprite: data.avatarSprite || 'ibarbash',
      });
    });
    return list;
  } catch (error: any) {
    if (error?.message?.includes('insufficient permissions') || error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.LIST, pathForQuery);
    }
    console.warn('Could not fetch cloud ranking, falling back to local ranking:', error);
    return [];
  }
};

// Admin Functions: Retrieve and manage all user profiles from Firestore
export const fetchAllUsersForAdmin = async (): Promise<UserProfile[]> => {
  const pathForQuery = 'users';
  try {
    const usersRef = collection(db, pathForQuery);
    const querySnapshot = await getDocs(usersRef);
    const list: UserProfile[] = [];
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data() as UserProfile;
      list.push(data);
    });
    return list;
  } catch (error: any) {
    console.error('Error fetching all users for admin:', error);
    return [];
  }
};

export const adminDeleteUserDoc = async (userId: string): Promise<boolean> => {
  const pathForDelete = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    return true;
  } catch (error: any) {
    console.error('Error deleting user profile:', error);
    return false;
  }
};

