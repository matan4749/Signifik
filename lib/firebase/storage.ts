'use client';

import { MAX_FILE_SIZE_MB } from '@/lib/utils/constants';

export type UploadType = 'logo' | 'hero' | 'gallery';

/**
 * Uploads a site image through the server-side /api/upload route (Admin SDK).
 * This bypasses Firebase Storage client rules entirely.
 */
export async function uploadSiteImage(
  uid: string,
  siteId: string,
  type: UploadType,
  file: File
): Promise<string> {
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('siteId', siteId);
  formData.append('type', type);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Upload failed');
  }

  const { url } = await res.json();
  return url;
}

export async function deleteSiteImage(_url: string): Promise<void> {
  // Deletion is handled server-side — no-op on client
}
