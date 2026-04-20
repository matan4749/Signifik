'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { SignifikLogo } from '@/components/ui/SignifikLogo';
import { UserAvatar } from '@/components/layout/UserAvatar';
import { useLang } from '@/lib/i18n/context';
import { LangToggle } from '@/components/ui/LangToggle';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const { t } = useLang();
  const { user, loading } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/">
          <SignifikLogo height={28} />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangToggle />
          {!loading && user ? (
            /* Authenticated: show avatar + go to dashboard */
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">{t.sidebar_dashboard}</Button>
              </Link>
              <UserAvatar size={32} />
            </>
          ) : (
            /* Guest: show sign in / start free */
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">{t.nav_signin}</Button>
              </Link>
              <Link href="/signup" className="hidden sm:block">
                <Button size="sm">{t.nav_start_free}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
