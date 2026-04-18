import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase/admin';
import { deploySite } from '@/lib/vercel/deploy';
import { sendNewSiteLaunchedEmail } from '@/lib/sendgrid/notifications';
import { addDomainToProject } from '@/lib/vercel/domains';
import type { CreateSitePayload } from '@/types/site';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;

    const body = (await req.json()) as CreateSitePayload;
    const { config, slug, customDomain } = body;

    if (!config || !slug) {
      return NextResponse.json({ error: 'config and slug are required' }, { status: 400 });
    }

    const db = getAdminFirestore();

    // Check subscription
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();
    const subStatus = userData?.subscription?.status;
    if (subStatus && !['trialing', 'active'].includes(subStatus)) {
      return NextResponse.json({ error: 'Active subscription required' }, { status: 403 });
    }

    // Check site limit
    const existingSites = await db.collection('sites').where('ownerId', '==', uid).get();
    if (existingSites.size >= 3) {
      return NextResponse.json({ error: 'Site limit reached (max 3)' }, { status: 403 });
    }

    const siteId = nanoid();

    // Create site in Firestore with pending status
    await db.collection('sites').doc(siteId).set({
      id: siteId,
      ownerId: uid,
      name: config.businessName,
      slug,
      customDomain: customDomain || null,
      config,
      deployment: { status: 'pending' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Deploy asynchronously - update status in background
    (async () => {
      try {
        await db.collection('sites').doc(siteId).update({ 'deployment.status': 'building' });
        const { projectId, deploymentId, url } = await deploySite(config, siteId, slug);

        if (customDomain) {
          try {
            await addDomainToProject(projectId, customDomain);
          } catch {
            // Non-fatal: domain might need manual DNS setup
          }
        }

        await db.collection('sites').doc(siteId).update({
          'deployment.status': 'ready',
          'deployment.vercelProjectId': projectId,
          'deployment.vercelDeploymentId': deploymentId,
          'deployment.url': url,
          'deployment.deployedAt': new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Send admin notification
        await sendNewSiteLaunchedEmail({
          customerName: userData?.displayName || decoded.email || 'Customer',
          customerEmail: decoded.email || '',
          businessName: config.businessName,
          siteUrl: url,
          siteId,
        });
      } catch (deployError) {
        console.error('Deploy error:', deployError);
        await db.collection('sites').doc(siteId).update({
          'deployment.status': 'error',
          'deployment.error': String(deployError),
        });
      }
    })();

    return NextResponse.json({ siteId }, { status: 201 });
  } catch (error) {
    console.error('Create site error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Avoid importing nanoid as ESM-only; use crypto instead
function nanoid(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 20);
}
