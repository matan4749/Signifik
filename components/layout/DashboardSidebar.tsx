'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Plus, Settings, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLang } from '@/lib/i18n/context';
import { LangToggle } from '@/components/ui/LangToggle';
import { SignifikLogo } from '@/components/ui/SignifikLogo';
import { UserAvatar } from '@/components/layout/UserAvatar';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { t } = useLang();

  const navItems = [
    { href: '/dashboard', label: t.sidebar_dashboard, icon: LayoutDashboard },
    { href: '/builder', label: t.sidebar_new_site, icon: Plus },
    { href: '/account', label: t.sidebar_account, icon: Settings },
    { href: '/account/billing', label: t.sidebar_billing, icon: CreditCard },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 z-30 max-md:hidden flex flex-col border-r border-white/8 bg-gray-950/80 backdrop-blur-xl">
      {/* Logo + avatar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
        <Link href="/dashboard">
          <SignifikLogo height={24} />
        </Link>
        <UserAvatar size={30} />
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

      {/* Lang toggle */}
      <div className="px-3 pb-4 border-t border-white/8 pt-4">
        <div className="px-3">
          <LangToggle />
        </div>
      </div>
    </aside>
  );
}
