import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession, getAdminFirestore } from '@/lib/firebase/admin';
import { deploySite } from '@/lib/vercel/deploy';
import { sendNewSiteLaunchedEmail } from '@/lib/sendgrid/notifications';
import { addDomainToProject } from '@/lib/vercel/domains';
import type { CreateSitePayload, Site } from '@/types/site';

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

export async function GET() {
  const uid = await getUid();
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const db = getAdminFirestore();
    const snap = await db.collection('sites').where('ownerId', '==', uid).get();
    const sites = snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as Site))
      .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    return NextResponse.json({ sites });
  } catch (err) {
    console.error('GET /api/sites error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const uid = await getUid();
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = (await req.json()) as CreateSitePayload;
    const { config, slug, customDomain } = body;

    if (!config || !slug) {
      return NextResponse.json({ error: 'config and slug are required' }, { status: 400 });
    }

    const db = getAdminFirestore();

    // Check site limit (skip subscription check — billing coming soon)
    const existingSites = await db.collection('sites').where('ownerId', '==', uid).get();
    if (existingSites.size >= 3) {
      return NextResponse.json({ error: 'Site limit reached (max 3)' }, { status: 403 });
    }

    const siteId = nanoid();

    await db.collection('sites').doc(siteId).set({
      id: siteId,
      ownerId: uid,
      name: config.businessName,
      slug,
      customDomain: customDomain || null,
      config,
      deployment: { status: 'building' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Deploy synchronously — Vercel Hobby plan kills background tasks immediately
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    try {
      const { projectId, deploymentId, url } = await deploySite(config, siteId, slug);

      if (customDomain) {
        try { await addDomainToProject(projectId, customDomain); } catch { /* non-fatal */ }
      }

      await db.collection('sites').doc(siteId).update({
        'deployment.status': 'ready',
        'deployment.vercelProjectId': projectId,
        'deployment.vercelDeploymentId': deploymentId,
        'deployment.url': url,
        'deployment.deployedAt': new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      sendNewSiteLaunchedEmail({
        customerName: userData?.displayName || '',
        customerEmail: userData?.email || '',
        businessName: config.businessName,
        siteUrl: url,
        siteId,
      }).catch(() => {});
    } catch (deployError) {
      const errMsg = deployError instanceof Error ? deployError.message : String(deployError);
      console.error('Deploy error for site', siteId, ':', errMsg);
      await db.collection('sites').doc(siteId).update({
        'deployment.status': 'error',
        'deployment.error': errMsg,
      });
      return NextResponse.json({ siteId, error: errMsg }, { status: 500 });
    }

    return NextResponse.json({ siteId }, { status: 201 });
  } catch (err) {
    console.error('POST /api/sites error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function nanoid(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 20);
}
