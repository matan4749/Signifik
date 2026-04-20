const VERCEL_API = 'https://api.vercel.com';

export interface VercelApiOptions {
  method?: string;
  body?: unknown;
}

export async function vercelFetch<T>(path: string, options: VercelApiOptions = {}): Promise<T> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error('VERCEL_TOKEN is not set');

  const url = new URL(path, VERCEL_API);
  const teamId = process.env.VERCEL_TEAM_ID?.trim();
  if (teamId) url.searchParams.set('teamId', teamId);

  const res = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Vercel API error ${res.status}: ${error}`);
  }

  return res.json() as Promise<T>;
}
