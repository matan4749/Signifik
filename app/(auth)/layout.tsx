import type { ReactNode } from 'react';

// Auth-guard redirect is handled by middleware.ts — no client-side check needed here
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
