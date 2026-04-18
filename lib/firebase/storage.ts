'use client';

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './client';
import { MAX_FILE_SIZE_MB } from '@/lib/utils/constants';

export type UploadType = 'logo' | 'hero' | 'gallery';

function getStoragePath(uid: string, siteId: string, type: UploadType, filename: string): string {
  return `sites/${uid}/${siteId}/${type}/${filename}`;
}

export async function uploadSiteImage(
  uid: string,
  siteId: string,
  type: UploadType,
  file: File
): Promise<string> {
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${Date.now()}.${ext}`;
  const path = getStoragePath(uid, siteId, type, filename);
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: { uploadedBy: uid },
  });

  return getDownloadURL(storageRef);
}

export async function deleteSiteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // Ignore errors on delete
  }
}
