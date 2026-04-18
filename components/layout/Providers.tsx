'use client';

import { type ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import { LangProvider } from '@/lib/i18n/context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <ToastProvider>{children}</ToastProvider>
    </LangProvider>
  );
}
