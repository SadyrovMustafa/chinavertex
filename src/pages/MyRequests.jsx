import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';
import { DataTable } from '../components/ui/DataTable';
import { useAuthStore } from '../store/authStore';
import { useOperationsStore } from '../store/operationsStore';
import { formatDate } from '../lib/utils';

export function MyRequests() {
  const user = useAuthStore((s) => s.user);
  const quoteRequests = useOperationsStore((s) => s.quoteRequests);
  const sourcingRequests = useOperationsStore((s) => s.sourcingRequests);

  const myQ = quoteRequests.filter((r) => r.userId === user?.id);
  const myS = sourcingRequests.filter((r) => r.userId === user?.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-zinc-50">Мои заявки</h1>
        <p className="mt-2 text-zinc-400">
          Запросы цен по каталогу и отдельные sourcing-запросы по фото и ссылке.
        </p>
      </motion.div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-200">Запросы цен</h2>
        <div className="mt-4">
          <DataTable
            emptyText="Нет заявок по каталогу"
            columns={[
              { key: 'productName', title: 'Товар' },
              {
                key: 'quantity',
                title: 'Кол-во',
                render: (row) => row.quantity,
              },
              {
                key: 'status',
                title: 'Статус',
                render: (row) => <StatusBadge status={row.status} />,
              },
              {
                key: 'createdAt',
                title: 'Создана',
                render: (row) => formatDate(row.createdAt),
              },
            ]}
            rows={myQ}
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-zinc-200">Sourcing</h2>
        <div className="mt-4">
          <DataTable
            emptyText="Нет sourcing-запросов"
            columns={[
              {
                key: 'description',
                title: 'Описание',
                render: (row) => (
                  <span className="line-clamp-2">{row.description || row.productUrl}</span>
                ),
              },
              {
                key: 'quantity',
                title: 'Кол-во',
                render: (row) => row.quantity,
              },
              {
                key: 'status',
                title: 'Статус',
                render: (row) => <StatusBadge status={row.status} />,
              },
              {
                key: 'createdAt',
                title: 'Создана',
                render: (row) => formatDate(row.createdAt),
              },
            ]}
            rows={myS}
          />
        </div>
      </section>

      <p className="mt-8 text-center text-sm text-zinc-500">
        Нужен новый поиск?{' '}
        <Link to="/sourcing" className="text-brand-400 hover:underline">
          Форма sourcing
        </Link>
      </p>
    </div>
  );
}
