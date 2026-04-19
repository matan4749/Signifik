'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { SignifikLogo } from '@/components/ui/SignifikLogo';
import { signIn, signInWithGoogle, getGoogleRedirectResult, createSession, getIdToken } from '@/lib/firebase/auth';
import { createUser } from '@/lib/firebase/firestore';
import { useToast } from '@/components/ui/Toast';
import { useLang } from '@/lib/i18n/context';

function firebaseErrorToHebrew(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'האימייל או הסיסמה שגויים';
    case 'auth/invalid-email':
      return 'כתובת אימייל לא תקינה';
    case 'auth/too-many-requests':
      return 'יותר מדי ניסיונות. נסה שוב מאוחר יותר';
    case 'auth/user-disabled':
      return 'החשבון הזה מושבת';
    case 'auth/network-request-failed':
      return 'בעיית רשת. בדוק את החיבור לאינטרנט';
    default:
      return 'שגיאה בהתחברות. נסה שנית';
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(true);
  const router = useRouter();
  const { error } = useToast();
  const { t } = useLang();

  // Handle Google redirect result on page load
  useEffect(() => {
    getGoogleRedirectResult()
      .then(async (user) => {
        if (!user) { setGoogleLoading(false); return; }
        await createUser(user.uid, {
          email: user.email ?? '',
          displayName: user.displayName ?? '',
          createdAt: new Date().toISOString(),
        }).catch(() => {});
        const token = await getIdToken();
        if (token) {
          const res = await createSession(token);
          if (!res.ok) throw new Error('session_failed');
        }
        router.push('/dashboard');
      })
      .catch(() => setGoogleLoading(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      const token = await getIdToken();
      if (token) {
        const res = await createSession(token);
        if (!res.ok) throw new Error('session');
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      error('כניסה נכשלה', firebaseErrorToHebrew(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      await createUser(user.uid, {
        email: user.email ?? '',
        displayName: user.displayName ?? '',
        createdAt: new Date().toISOString(),
      }).catch(() => {});
      const token = await getIdToken();
      if (token) {
        const res = await createSession(token);
        if (!res.ok) throw new Error('session');
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'REDIRECT') return; // page will reload — useEffect handles it
      error('כניסה עם Google נכשלה', 'נסה שנית');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen liquid-bg flex items-center justify-center p-4">
      {/* Back to home */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-white/30 hover:text-white/70 transition-colors">
        <ArrowLeft size={15} />
        <span>חזרה</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><SignifikLogo height={44} /></div>
          <p className="text-white/40 text-sm mt-1">{t.login_title}</p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-150 text-sm font-medium text-white/80 hover:text-white disabled:opacity-50"
          >
            {googleLoading ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
              </svg>
            )}
            {t.auth_google}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/25">{t.auth_or}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={t.login_email} type="email" placeholder={t.login_email_placeholder} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <Input label={t.login_password} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">{t.login_submit}</Button>
          </form>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          {t.login_no_account}{' '}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">{t.login_create}</Link>
        </p>
      </motion.div>
    </div>
  );
}
