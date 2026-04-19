import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;

function getAdminApp(): App {
  if (adminApp) return adminApp;
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp;
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });

  return adminApp;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp());
}

/**
 * Verifies a session cookie OR a raw ID token (fallback path).
 * Returns the decoded token with uid, or throws.
 */
export async function verifySession(sessionValue: string) {
  const adminAuth = getAdminAuth();
  // Try session cookie first (the happy path)
  try {
    return await adminAuth.verifySessionCookie(sessionValue, true);
  } catch {
    // Fall back to ID token verification (used when createSessionCookie failed)
    return await adminAuth.verifyIdToken(sessionValue, true);
  }
}
