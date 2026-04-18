import { vercelFetch } from './client';

export interface VercelDomain {
  name: string;
  apexName: string;
  verification?: Array<{ type: string; domain: string; value: string; reason: string }>;
  verified: boolean;
}

export async function addDomainToProject(projectId: string, domain: string): Promise<VercelDomain> {
  return vercelFetch<VercelDomain>(`/v10/projects/${projectId}/domains`, {
    method: 'POST',
    body: { name: domain },
  });
}

export async function removeDomainFromProject(projectId: string, domain: string): Promise<void> {
  await vercelFetch(`/v10/projects/${projectId}/domains/${domain}`, {
    method: 'DELETE',
  });
}

export async function verifyDomain(projectId: string, domain: string): Promise<VercelDomain> {
  return vercelFetch<VercelDomain>(`/v10/projects/${projectId}/domains/${domain}/verify`, {
    method: 'POST',
  });
}

export async function getDomainInfo(domain: string): Promise<VercelDomain> {
  return vercelFetch<VercelDomain>(`/v5/domains/${domain}`);
}
