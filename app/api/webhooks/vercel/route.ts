import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import type { DeploymentStatus } from '@/types/site';

interface VercelWebhookPayload {
  type: string;
  payload: {
    deployment: { id: string; url: string; readyState: string };
    project: { id: string };
  };
}

function mapVercelStatus(readyState: string): DeploymentStatus {
  const map: Record<string, DeploymentStatus> = {
    READY: 'ready',
    ERROR: 'error',
    CANCELED: 'error',
    BUILDING: 'building',
    QUEUED: 'pending',
  };
  return map[readyState] ?? 'pending';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VercelWebhookPayload;
    const { deployment, project } = body.payload || {};

    if (!deployment?.id) return NextResponse.json({ received: true });

    const db = getAdminFirestore();
    const sites = await db.collection('sites')
      .where('deployment.vercelDeploymentId', '==', deployment.id)
      .limit(1)
      .get();

    if (sites.empty) return NextResponse.json({ received: true });

    const site = sites.docs[0];
    const status = mapVercelStatus(deployment.readyState);

    await site.ref.update({
      'deployment.status': status,
      'deployment.url': `https://${deployment.url}`,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Vercel webhook error:', error);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }
}
