import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let _adminApp: App;

function initAdminApp(): App {
  if (_adminApp) return _adminApp;
  if (getApps().length > 0) {
    _adminApp = getApps()[0];
    return _adminApp;
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  _adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });

  return _adminApp;
}

export function getAdminApp(): App {
  return initAdminApp();
}

export function getAdminAuth() {
  return getAuth(initAdminApp());
}

export function getAdminFirestore() {
  return getFirestore(initAdminApp());
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
