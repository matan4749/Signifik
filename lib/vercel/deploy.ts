import { vercelFetch } from './client';
import { generateSiteFiles } from './templates';
import type { SiteConfig } from '@/types/site';

export interface VercelProject {
  id: string;
  name: string;
  alias?: Array<{ domain: string }>;
}

export interface VercelDeployment {
  id: string;
  url: string;
  readyState: 'QUEUED' | 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED';
  createdAt: number;
  alias?: string[];
}

async function sha1(content: string): Promise<string> {
  const data = new TextEncoder().encode(content);
  const buf = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── Project management ──────────────────────────────────────────────────────

export async function createOrGetProject(slug: string): Promise<VercelProject> {
  const name = `signifik-${slug}`;
  try {
    return await vercelFetch<VercelProject>(`/v9/projects/${name}`);
  } catch {
    return vercelFetch<VercelProject>('/v10/projects', {
      method: 'POST',
      body: { name, framework: null },
    });
  }
}

// ── File upload ──────────────────────────────────────────────────────────────

async function uploadFile(
  content: string,
  mimeType: string
): Promise<{ sha: string; size: number }> {
  const encoded = new TextEncoder().encode(content);
  const sha = await sha1(content);
  const size = encoded.length;

  const res = await fetch('https://api.vercel.com/v2/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      'Content-Length': String(size),
      'x-vercel-digest': sha,
      'Content-Type': mimeType,
    },
    body: content,
  });

  // 200 = uploaded, 409 = already exists — both are fine
  if (!res.ok && res.status !== 409) {
    throw new Error(`File upload failed: ${res.status} ${await res.text()}`);
  }

  return { sha, size };
}

export async function uploadFiles(
  files: Array<{ file: string; data: string }>
): Promise<Array<{ file: string; sha: string; size: number }>> {
  const mimeFor = (name: string) =>
    name.endsWith('.html') ? 'text/html' :
    name.endsWith('.css')  ? 'text/css' :
    name.endsWith('.js')   ? 'application/javascript' :
    'application/octet-stream';

  return Promise.all(
    files.map(async (f) => {
      const { sha, size } = await uploadFile(f.data, mimeFor(f.file));
      return { file: f.file, sha, size };
    })
  );
}

// ── Deployment ───────────────────────────────────────────────────────────────

export async function createDeployment(
  _projectId: string,
  slug: string,
  uploadedFiles: Array<{ file: string; sha: string; size: number }>
): Promise<VercelDeployment> {
  // Note: projectId must NOT be in the body for Vercel API v13 — use project name instead
  return vercelFetch<VercelDeployment>('/v13/deployments', {
    method: 'POST',
    body: {
      name: `signifik-${slug}`,
      target: 'production',
      files: uploadedFiles.map(({ file, sha, size }) => ({ file, sha, size })),
      projectSettings: { framework: null, outputDirectory: null },
    },
  });
}

/**
 * Full deploy pipeline:
 * 1. Generate HTML/CSS from SiteConfig
 * 2. Upload files to Vercel blob store
 * 3. Create production deployment
 * 4. Return project ID, deployment ID, and canonical URL
 */
export async function deploySite(
  config: SiteConfig,
  siteId: string,
  slug: string
): Promise<{ projectId: string; deploymentId: string; url: string }> {
  const files = generateSiteFiles(config, siteId);
  const project = await createOrGetProject(slug);
  const uploaded = await uploadFiles(files);
  const deployment = await createDeployment(project.id, slug, uploaded);

  // Prefer first alias (branded domain) over auto-generated Vercel URL
  const rawUrl = deployment.alias?.[0] ?? deployment.url;
  const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

  return { projectId: project.id, deploymentId: deployment.id, url };
}

// ── Deployment status ────────────────────────────────────────────────────────

export async function getDeploymentStatus(deploymentId: string): Promise<VercelDeployment> {
  return vercelFetch<VercelDeployment>(`/v13/deployments/${deploymentId}`);
}

// ── Kill switch ──────────────────────────────────────────────────────────────

/**
 * Disable: deploy a "site offline" page over the existing project.
 * This is reversible — a redeploy with real content restores the site.
 */
export async function disableSite(projectId: string, slug: string): Promise<void> {
  const offlineHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Site Temporarily Offline</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center;
           justify-content: center; min-height: 100vh; margin: 0;
           background: #030712; color: #f5f5f7; text-align: center; }
    h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: .5rem; }
    p  { color: rgba(245,245,247,.4); font-size: .875rem; }
  </style>
</head>
<body>
  <div>
    <h1>This site is temporarily offline</h1>
    <p>The owner needs to renew their Signifik subscription to restore it.</p>
  </div>
</body>
</html>`;

  const sha = await sha1(offlineHtml);
  const size = new TextEncoder().encode(offlineHtml).length;

  await fetch('https://api.vercel.com/v2/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      'Content-Length': String(size),
      'x-vercel-digest': sha,
      'Content-Type': 'text/html',
    },
    body: offlineHtml,
  });

  await vercelFetch('/v13/deployments', {
    method: 'POST',
    body: {
      name: `signifik-${slug}`,
      projectId,
      target: 'production',
      files: [{ file: 'index.html', sha, size }],
      projectSettings: { framework: null, outputDirectory: null },
    },
  });
}

/**
 * Hard delete: removes the Vercel project entirely.
 * Used when a Firestore document is deleted or after prolonged non-payment.
 */
export async function deleteProject(projectId: string): Promise<void> {
  await vercelFetch(`/v9/projects/${projectId}`, { method: 'DELETE' });
}
