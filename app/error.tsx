'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error?.message, error?.digest);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-center">
      <div>
        <div className="h-16 w-16 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">משהו השתבש</h2>
        <p className="text-white/40 text-sm mb-6 max-w-xs mx-auto">
          אירעה שגיאה. נסה לרענן את הדף.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors"
        >
          נסה שנית
        </button>
      </div>
    </div>
  );
}
