'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, User } from 'lucide-react';
import { signOut } from '@/lib/firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { useLang } from '@/lib/i18n/context';
import { cn } from '@/lib/utils/cn';

interface UserAvatarProps {
  /** Size of the avatar circle in px. Default: 32 */
  size?: number;
}

export function UserAvatar({ size = 32 }: UserAvatarProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { error } = useToast();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleSignOut = async () => {
    setOpen(false);
    try {
      await signOut();
      router.push('/login');
    } catch {
      error('Sign out failed', 'Please try again');
    }
  };

  if (!user) return null;

  const photoUrl = user.photoURL;
  const initials = (user.displayName ?? user.email ?? '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="User menu"
        className={cn(
          'rounded-full overflow-hidden border-2 transition-all duration-150',
          open ? 'border-indigo-400' : 'border-white/20 hover:border-white/40'
        )}
        style={{ width: size, height: size }}
      >
        {photoUrl ? (
          /* Google profile photo — next/image handles CORS + optimization */
          <Image
            src={photoUrl}
            alt={user.displayName ?? 'User'}
            width={size}
            height={size}
            className="object-cover w-full h-full"
            referrerPolicy="no-referrer"
            unoptimized
          />
        ) : (
          /* Fallback: initials */
          <span
            className="flex items-center justify-center w-full h-full bg-indigo-500/20 text-indigo-300 font-semibold select-none"
            style={{ fontSize: size * 0.38 }}
          >
            {initials || <User size={size * 0.5} />}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 mt-2 w-56 rounded-2xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-xl z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-white/8">
            <p className="text-sm font-medium text-white truncate">
              {user.displayName ?? t.sidebar_account}
            </p>
            <p className="text-xs text-white/40 truncate">{user.email}</p>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/6 transition-all duration-150"
            >
              <LogOut size={14} className="shrink-0" />
              {t.sidebar_signout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
