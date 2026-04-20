import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession, getAdminFirestore } from '@/lib/firebase/admin';
import { deploySite } from '@/lib/vercel/deploy';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  try {
    const { siteId } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySession(sessionCookie);
    const uid = decoded.uid;

    const db = getAdminFirestore();
    const siteDoc = await db.collection('sites').doc(siteId).get();
    if (!siteDoc.exists || siteDoc.data()?.ownerId !== uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const siteData = siteDoc.data()!;
    await db.collection('sites').doc(siteId).update({ 'deployment.status': 'building' });

    // Run synchronously — Vercel Hobby plan kills background tasks
    try {
      const { projectId, deploymentId, url } = await deploySite(
        siteData.config,
        siteId,
        siteData.slug
      );

      await db.collection('sites').doc(siteId).update({
        'deployment.status': 'ready',
        'deployment.vercelProjectId': projectId,
        'deployment.vercelDeploymentId': deploymentId,
        'deployment.url': url,
        'deployment.deployedAt': new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, url });
    } catch (deployError) {
      const errMsg = deployError instanceof Error ? deployError.message : String(deployError);
      console.error('Redeploy error for site', siteId, ':', errMsg);
      await db.collection('sites').doc(siteId).update({
        'deployment.status': 'error',
        'deployment.error': errMsg,
      });
      return NextResponse.json({ error: errMsg }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
