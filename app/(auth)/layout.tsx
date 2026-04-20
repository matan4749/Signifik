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

  // Show a minimal spinner while checking auth — never a blank screen
  if (loading) {
    return (
      <div className="min-h-screen liquid-bg flex items-center justify-center">
        <span className="h-6 w-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  // Authenticated: redirect happening, show nothing meanwhile
  if (user) return null;

  return <>{children}</>;
}
