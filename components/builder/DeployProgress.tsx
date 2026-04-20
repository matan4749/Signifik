'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Loader2, XCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui';
import type { DeploymentStatus } from '@/types/site';
import { cn } from '@/lib/utils/cn';
import { useLang } from '@/lib/i18n/context';

interface DeployProgressProps {
  status: DeploymentStatus;
  url?: string;
  errorMessage?: string | null;
  onGoToDashboard: () => void;
}

function getStepStatus(threshold: string, current: DeploymentStatus) {
  const order = ['pending', 'building', 'ready'];
  const currentIdx = order.indexOf(current);
  const thresholdIdx = order.indexOf(threshold);
  if (current === 'error') return thresholdIdx === 0 ? 'error' : 'pending';
  if (currentIdx > thresholdIdx) return 'done';
  if (currentIdx === thresholdIdx) return 'loading';
  return 'pending';
}

export function DeployProgress({ status, url, errorMessage, onGoToDashboard }: DeployProgressProps) {
  const { t } = useLang();
  const isError = status === 'error';
  const isReady = status === 'ready';

  const steps = [
    { id: 'generating', label: t.deploy_generating, threshold: 'pending' },
    { id: 'uploading', label: t.deploy_uploading, threshold: 'building' },
    { id: 'deploying', label: t.deploy_deploying, threshold: 'ready' },
  ];

  return (
    <div className="min-h-screen liquid-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          {isReady ? (
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
          ) : isError ? (
            <div className="h-16 w-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} className="text-red-400" />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
              <Loader2 size={32} className="text-indigo-400 animate-spin" />
            </div>
          )}
          <h2 className="text-2xl font-bold text-white">
            {isReady ? t.deploy_live_title : isError ? t.deploy_failed_title : t.deploy_in_progress}
          </h2>
          <p className="text-white/40 text-sm mt-2">
            {isReady
              ? t.deploy_live_sub
              : isError
              ? t.deploy_failed_sub
              : t.deploy_time_hint}
          </p>
          {isError && errorMessage && (
            <p className="text-red-400/70 text-xs mt-2 font-mono max-w-sm mx-auto break-all">
              {errorMessage}
            </p>
          )}
        </motion.div>

        <div className="space-y-3 mb-8">
          {steps.map((step, i) => {
            const stepStatus = getStepStatus(step.threshold, status);
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 border',
                  stepStatus === 'done' && 'border-emerald-500/20 bg-emerald-500/8',
                  stepStatus === 'loading' && 'border-indigo-500/20 bg-indigo-500/8',
                  stepStatus === 'error' && 'border-red-500/20 bg-red-500/8',
                  stepStatus === 'pending' && 'border-white/8 bg-white/3'
                )}
              >
                <div className="shrink-0">
                  {stepStatus === 'done' && <CheckCircle size={16} className="text-emerald-400" />}
                  {stepStatus === 'loading' && <Loader2 size={16} className="text-indigo-400 animate-spin" />}
                  {stepStatus === 'error' && <XCircle size={16} className="text-red-400" />}
                  {stepStatus === 'pending' && (
                    <div className="h-4 w-4 rounded-full border border-white/20" />
                  )}
                </div>
                <span className={cn(
                  'text-sm font-medium',
                  stepStatus === 'done' && 'text-emerald-300',
                  stepStatus === 'loading' && 'text-indigo-300',
                  stepStatus === 'error' && 'text-red-300',
                  stepStatus === 'pending' && 'text-white/30'
                )}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {isReady && url && (
          <div className="space-y-3">
            <a
              href={url}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400 hover:bg-emerald-500/15 transition-colors"
            >
              <ExternalLink size={14} />
              {url}
            </a>
            <Button onClick={onGoToDashboard} size="lg" className="w-full">
              {t.deploy_go_dashboard}
            </Button>
          </div>
        )}

        {isError && (
          <Button variant="danger" size="lg" className="w-full" onClick={onGoToDashboard}>
            {t.deploy_back}
          </Button>
        )}
      </div>
    </div>
  );
}
