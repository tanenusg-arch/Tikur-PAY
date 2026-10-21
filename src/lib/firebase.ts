import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  EfootballAccount,
  PurchasedOrder,
  PendingAccountSubmission,
  AdminPaymentConfig,
} from '../types/account';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: The app requires firestoreDatabaseId passed to getFirestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Error Handling Specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// Connection test at boot
export async function testFirebaseConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
  }
}

// --- Accounts Operations ---

export async function saveAccountToFirestore(account: EfootballAccount): Promise<void> {
  const path = 'accounts';
  try {
    await setDoc(doc(db, path, account.id), account);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${account.id}`);
  }
}

export async function getAccountsFromFirestore(): Promise<EfootballAccount[]> {
  const path = 'accounts';
  try {
    const snapshot = await getDocs(collection(db, path));
    const items: EfootballAccount[] = [];
    snapshot.forEach((d) => {
      items.push(d.data() as EfootballAccount);
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function updateAccountLockInFirestore(
  accountId: string,
  lockData: {
    lockedUntil?: number;
    lockedBy?: { id: number | string; username?: string; firstName?: string };
    status?: 'active' | 'locked' | 'payment_review' | 'sold';
  }
): Promise<void> {
  const path = 'accounts';
  try {
    await updateDoc(doc(db, path, accountId), lockData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${accountId}`);
  }
}

export async function updateAccountInFirestore(
  accountId: string,
  updates: Partial<EfootballAccount>
): Promise<void> {
  const path = 'accounts';
  try {
    await updateDoc(doc(db, path, accountId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${accountId}`);
  }
}

export async function deleteAccountFromFirestore(accountId: string): Promise<void> {
  const path = 'accounts';
  try {
    await deleteDoc(doc(db, path, accountId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${accountId}`);
  }
}

// --- Orders Operations ---

export async function saveOrderToFirestore(order: PurchasedOrder): Promise<void> {
  const path = 'orders';
  try {
    await setDoc(doc(db, path, order.orderId), order);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${order.orderId}`);
  }
}

export async function getOrdersFromFirestore(): Promise<PurchasedOrder[]> {
  const path = 'orders';
  try {
    const snapshot = await getDocs(collection(db, path));
    const items: PurchasedOrder[] = [];
    snapshot.forEach((d) => {
      items.push(d.data() as PurchasedOrder);
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  updates: Partial<PurchasedOrder>
): Promise<void> {
  const path = 'orders';
  try {
    await updateDoc(doc(db, path, orderId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${orderId}`);
  }
}

// --- Pending Submissions Operations (Users selling accounts -> Admin approval) ---

export async function savePendingSubmissionToFirestore(submission: PendingAccountSubmission): Promise<void> {
  const path = 'pending_accounts';
  try {
    await setDoc(doc(db, path, submission.id), submission);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${submission.id}`);
  }
}

export async function getPendingSubmissionsFromFirestore(): Promise<PendingAccountSubmission[]> {
  const path = 'pending_accounts';
  try {
    const snapshot = await getDocs(collection(db, path));
    const items: PendingAccountSubmission[] = [];
    snapshot.forEach((d) => {
      items.push(d.data() as PendingAccountSubmission);
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function updatePendingSubmissionInFirestore(
  submissionId: string,
  updates: Partial<PendingAccountSubmission>
): Promise<void> {
  const path = 'pending_accounts';
  try {
    await updateDoc(doc(db, path, submissionId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${submissionId}`);
  }
}

export async function deletePendingSubmissionFromFirestore(submissionId: string): Promise<void> {
  const path = 'pending_accounts';
  try {
    await deleteDoc(doc(db, path, submissionId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${submissionId}`);
  }
}

// --- Admin Payment Accounts Configuration Operations ---

export const DEFAULT_ADMIN_PAYMENT_CONFIG: AdminPaymentConfig = {
  telebirrNumber: '0911234567',
  telebirrAccountName: 'Bicho / eFootball Escrow',
  cbeAccountNumber: '1000 4829 1849 2',
  cbeAccountName: 'Bicho / eFootball Escrow CBE',
  instructions: 'Please transfer the exact ETB amount shown and take a clear screenshot of the confirmation page.',
  updatedAt: new Date().toISOString(),
};

export async function savePaymentConfigToFirestore(config: AdminPaymentConfig): Promise<void> {
  const path = 'config';
  try {
    await setDoc(doc(db, path, 'payment'), config);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/payment`);
  }
}

export async function getPaymentConfigFromFirestore(): Promise<AdminPaymentConfig | null> {
  const path = 'config';
  try {
    const snap = await getDoc(doc(db, path, 'payment'));
    if (snap.exists()) {
      return snap.data() as AdminPaymentConfig;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${path}/payment`);
    return null;
  }
}
