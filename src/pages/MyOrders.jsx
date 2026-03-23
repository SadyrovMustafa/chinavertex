import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { DataTable } from '../components/ui/DataTable';
import { useAuthStore } from '../store/authStore';
import { useOperationsStore } from '../store/operationsStore';
import { formatDate } from '../lib/utils';

export function MyOrders() {
  const user = useAuthStore((s) => s.user);
  const orders = useOperationsStore((s) => s.orders);
  const my = orders.filter((o) => o.userId === user?.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600/20 text-brand-400">
          <Package className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">Мои заказы</h1>
          <p className="mt-2 text-zinc-400">
            Статусы производства и отгрузки, трек-номер после передачи перевозчику.
          </p>
        </div>
      </motion.div>

      <div className="mt-10">
        <DataTable
          emptyText="Заказов пока нет"
          columns={[
            { key: 'title', title: 'Заказ' },
            {
              key: 'itemsSummary',
              title: 'Состав',
              render: (row) => (
                <span className="line-clamp-2 text-zinc-400">{row.itemsSummary}</span>
              ),
            },
            {
              key: 'status',
              title: 'Статус',
              render: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: 'trackingNumber',
              title: 'Трекинг',
              render: (row) => row.trackingNumber || '—',
            },
            {
              key: 'updatedAt',
              title: 'Обновлён',
              render: (row) => formatDate(row.updatedAt),
            },
          ]}
          rows={my}
        />
      </div>
    </div>
  );
}
