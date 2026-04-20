'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Don't flash auth form to an already-signed-in user
  if (loading || user) return null;

  return <>{children}</>;
}
