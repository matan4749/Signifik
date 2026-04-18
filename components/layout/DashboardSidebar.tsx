'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Plus, Settings, CreditCard, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { signOut } from '@/lib/firebase/auth';
import { useToast } from '@/components/ui/Toast';
import { useLang } from '@/lib/i18n/context';
import { LangToggle } from '@/components/ui/LangToggle';
import { SignifikLogo } from '@/components/ui/SignifikLogo';

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { error } = useToast();
  const { t } = useLang();

  const navItems = [
    { href: '/dashboard', label: t.sidebar_dashboard, icon: LayoutDashboard },
    { href: '/builder', label: t.sidebar_new_site, icon: Plus },
    { href: '/account', label: t.sidebar_account, icon: Settings },
    { href: '/account/billing', label: t.sidebar_billing, icon: CreditCard },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch {
      error('Sign out failed', 'Please try again');
    }
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 z-30 flex flex-col border-r border-white/8 bg-gray-950/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center justify-center px-5 py-5 border-b border-white/8">
        <Link href="/dashboard">
          <SignifikLogo height={24} />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/6'
              )}
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Lang toggle + Sign out */}
      <div className="px-3 pb-4 border-t border-white/8 pt-4 space-y-2">
        <div className="px-3">
          <LangToggle />
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/6 transition-all duration-150"
        >
          <LogOut size={16} className="shrink-0" />
          {t.sidebar_signout}
        </button>
      </div>
    </aside>
  );
}
