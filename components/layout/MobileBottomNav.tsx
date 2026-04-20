'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Plus, Settings, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLang } from '@/lib/i18n/context';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLang();

  const navItems = [
    { href: '/dashboard', label: t.sidebar_dashboard, icon: LayoutDashboard },
    { href: '/builder', label: t.sidebar_new_site, icon: Plus },
    { href: '/account', label: t.sidebar_account, icon: Settings },
    { href: '/account/billing', label: t.sidebar_billing, icon: CreditCard },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden flex items-center border-t border-white/8 bg-gray-950/90 backdrop-blur-xl">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-all duration-150',
              isActive
                ? 'text-indigo-400'
                : 'text-white/40 hover:text-white/70'
            )}
          >
            <Icon size={20} className="shrink-0" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
