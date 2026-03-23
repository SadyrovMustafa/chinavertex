import { Badge } from './ui/Badge';
import { STATUS_META } from '../lib/constants';
import { cn } from '../lib/utils';

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || {
    label: status,
    className: 'bg-zinc-600/20 text-zinc-300 border-zinc-600/40',
  };
  return (
    <Badge className={cn('border', meta.className)}>{meta.label}</Badge>
  );
}
