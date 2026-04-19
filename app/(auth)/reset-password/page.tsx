'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { SignifikLogo } from '@/components/ui/SignifikLogo';
import { resetPassword } from '@/lib/firebase/auth';
import { useLang } from '@/lib/i18n/context';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useLang();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        setErrorMsg('כתובת אימייל לא תקינה או לא קיימת');
      } else if (code === 'auth/too-many-requests') {
        setErrorMsg('יותר מדי ניסיונות. נסה שוב מאוחר יותר');
      } else {
        setErrorMsg('שגיאה בשליחה. נסה שנית');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen liquid-bg flex items-center justify-center p-4">
      <Link
        href="/login"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-white/30 hover:text-white/70 transition-colors"
      >
        <ArrowLeft size={15} />
        <span>{t.reset_back}</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SignifikLogo height={44} />
          </div>
          <h1 className="text-white font-semibold text-lg">{t.reset_title}</h1>
          <p className="text-white/40 text-sm mt-1">{t.reset_desc}</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center gap-4 py-4"
              >
                <div className="w-14 h-14 rounded-full bg-indigo-500/15 flex items-center justify-center">
                  <MailCheck size={28} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{t.reset_success_title}</p>
                  <p className="text-white/40 text-sm mt-1">{t.reset_success_desc(email)}</p>
                </div>
                <Link
                  href="/login"
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium mt-2"
                >
                  {t.reset_back}
                </Link>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <Input
                  label={t.reset_email}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />

                {errorMsg && (
                  <p className="text-red-400 text-sm text-center">{errorMsg}</p>
                )}

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full mt-2"
                  size="lg"
                >
                  {loading ? t.reset_sending : t.reset_submit}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
