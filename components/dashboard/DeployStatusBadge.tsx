'use client';

import { Badge } from '@/components/ui/Badge';
import type { DeploymentStatus } from '@/types/site';
import { useLang } from '@/lib/i18n/context';

export function DeployStatusBadge({ status }: { status: DeploymentStatus }) {
  const { t } = useLang();

  const config: Record<DeploymentStatus, { label: string; variant: 'success' | 'info' | 'warning' | 'danger' | 'default' }> = {
    ready: { label: t.status_live, variant: 'success' },
    building: { label: t.status_deploying, variant: 'info' },
    pending: { label: t.status_pending, variant: 'warning' },
    error: { label: t.status_error, variant: 'danger' },
    disabled: { label: t.status_disabled, variant: 'default' },
    idle: { label: t.status_draft, variant: 'default' },
  };

  const { label, variant } = config[status] || config.idle;
  return <Badge variant={variant} dot>{label}</Badge>;
}
