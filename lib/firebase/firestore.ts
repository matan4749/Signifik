import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './client';
import type { Site, SiteConfig, SiteDeployment } from '@/types/site';
import type { AppUser, Subscription } from '@/types/user';

// Collection references
export const usersCol = () => collection(db, 'users');
export const sitesCol = () => collection(db, 'sites');

// Converters
function toDate(ts: Timestamp | string | undefined): string | undefined {
  if (!ts) return undefined;
  if (typeof ts === 'string') return ts;
  return ts.toDate().toISOString();
}

function fromFirestoreUser(id: string, data: DocumentData): AppUser {
  return {
    uid: id,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL,
    subscription: data.subscription,
    createdAt: toDate(data.createdAt) ?? new Date().toISOString(),
  };
}

function fromFirestoreSite(id: string, data: DocumentData): Site {
  return {
    id,
    ownerId: data.ownerId,
    name: data.name,
    slug: data.slug,
    customDomain: data.customDomain,
    config: data.config as SiteConfig,
    deployment: data.deployment as SiteDeployment,
    createdAt: toDate(data.createdAt) ?? new Date().toISOString(),
    updatedAt: toDate(data.updatedAt) ?? new Date().toISOString(),
  };
}

// ---- User operations ----

export async function getUser(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(usersCol(), uid));
  if (!snap.exists()) return null;
  return fromFirestoreUser(snap.id, snap.data());
}

export async function createUser(uid: string, data: Partial<AppUser>): Promise<void> {
  await setDoc(doc(usersCol(), uid), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateUser(uid: string, data: Partial<AppUser>): Promise<void> {
  await updateDoc(doc(usersCol(), uid), { ...data });
}

export async function updateSubscription(uid: string, subscription: Partial<Subscription>): Promise<void> {
  await updateDoc(doc(usersCol(), uid), { subscription });
}

// ---- Site operations ----

export async function getSite(siteId: string): Promise<Site | null> {
  const snap = await getDoc(doc(sitesCol(), siteId));
  if (!snap.exists()) return null;
  return fromFirestoreSite(snap.id, snap.data());
}

export async function getUserSites(uid: string): Promise<Site[]> {
  const q = query(sitesCol(), where('ownerId', '==', uid));
  const snap = await getDocs(q);
  const sites = snap.docs.map((d) => fromFirestoreSite(d.id, d.data()));
  return sites.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
}

export async function createSite(siteId: string, data: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
  await setDoc(doc(sitesCol(), siteId), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateSite(siteId: string, data: Partial<Site>): Promise<void> {
  await updateDoc(doc(sitesCol(), siteId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function updateSiteDeployment(siteId: string, deployment: Partial<SiteDeployment>): Promise<void> {
  await updateDoc(doc(sitesCol(), siteId), {
    'deployment': deployment,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSite(siteId: string): Promise<void> {
  await deleteDoc(doc(sitesCol(), siteId));
}

// ---- Realtime subscriptions ----

export function subscribeToUserSites(uid: string, onUpdate: (sites: Site[]) => void) {
  const q = query(sitesCol(), where('ownerId', '==', uid));
  return onSnapshot(
    q,
    (snap) => {
      const sites = snap.docs
        .map((d) => fromFirestoreSite(d.id, d.data()))
        .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
      onUpdate(sites);
    },
    () => {
      // Firestore permission/network error — return empty list instead of crashing
      onUpdate([]);
    }
  );
}

export function subscribeToSite(siteId: string, onUpdate: (site: Site | null) => void) {
  return onSnapshot(doc(sitesCol(), siteId), (snap) => {
    if (!snap.exists()) {
      onUpdate(null);
      return;
    }
    onUpdate(fromFirestoreSite(snap.id, snap.data()));
  });
}
