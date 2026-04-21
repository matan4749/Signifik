import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession, getAdminApp, getAdminFirestore } from '@/lib/firebase/admin';
import { getStorage } from 'firebase-admin/storage';

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

async function getUid(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  try {
    const decoded = await verifySession(session);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const uid = await getUid();
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const siteId = formData.get('siteId') as string | null;
    const type = formData.get('type') as string | null;

    if (!file || !siteId || !type) {
      return NextResponse.json({ error: 'file, siteId, and type are required' }, { status: 400 });
    }

    // Allow draft- prefix for new sites being created in the wizard
    if (!siteId.startsWith('draft-')) {
      const db = getAdminFirestore();
      const siteDoc = await db.collection('sites').doc(siteId).get();
      if (!siteDoc.exists || siteDoc.data()?.ownerId !== uid) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `File exceeds ${MAX_FILE_SIZE_MB}MB limit` }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}.${ext}`;
    const storagePath = `sites/${uid}/${siteId}/${type}/${filename}`;

    const bucket = getStorage(getAdminApp()).bucket();
    console.log('[upload] bucket name:', bucket.name, '| env:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileRef = bucket.file(storagePath);

    await fileRef.save(fileBuffer, {
      metadata: {
        contentType: file.type,
        metadata: { uploadedBy: uid },
      },
    });

    await fileRef.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Upload error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
