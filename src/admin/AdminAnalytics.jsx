import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, GitBranch, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useOperationsStore } from '../store/operationsStore';
import { useAuthStore } from '../store/authStore';
import { STATUS, ROLES } from '../lib/constants';
import { DataTable } from '../components/ui/DataTable';

function hoursBetween(a, b) {
  return (new Date(b) - new Date(a)) / 3600000;
}

export function AdminAnalytics() {
  const quoteRequests = useOperationsStore((s) => s.quoteRequests);
  const sourcingRequests = useOperationsStore((s) => s.sourcingRequests);
  const orders = useOperationsStore((s) => s.orders);
  const users = useAuthStore((s) => s.users);

  const allReq = useMemo(
    () => [...quoteRequests, ...sourcingRequests],
    [quoteRequests, sourcingRequests]
  );

  const funnel = useMemo(() => {
    const by = (st) => allReq.filter((r) => r.status === st).length;
    return {
      new: by(STATUS.NEW),
      processing: by(STATUS.PROCESSING),
      supplierFound: by(STATUS.SUPPLIER_FOUND),
      production: by(STATUS.PRODUCTION),
      shipped: by(STATUS.SHIPPED),
      completed: by(STATUS.COMPLETED),
      total: allReq.length,
    };
  }, [allReq]);

  const conversion = useMemo(() => {
    if (!allReq.length) return 0;
    const withOrder = orders.filter((o) => o.relatedRequestId).length;
    return Math.round((withOrder / allReq.length) * 1000) / 10;
  }, [allReq.length, orders]);

  const avgResponseHours = useMemo(() => {
    const reacted = allReq.filter((r) => r.status !== STATUS.NEW);
    if (!reacted.length) return null;
    const sum = reacted.reduce(
      (acc, r) => acc + hoursBetween(r.createdAt, r.updatedAt),
      0
    );
    return Math.round((sum / reacted.length) * 10) / 10;
  }, [allReq]);

  const workload = useMemo(() => {
    const managers = users.filter(
      (u) => u.role === ROLES.MANAGER || u.role === ROLES.ADMIN
    );
    return managers.map((m) => {
      const assigned = allReq.filter(
        (r) => r.assignedManagerId === m.id && r.status !== STATUS.COMPLETED
      ).length;
      return { id: m.id, name: m.name, email: m.email, assigned };
    });
  }, [users, allReq]);

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-zinc-50">Аналитика</h1>
        <p className="text-sm text-zinc-400">
          Воронка по заявкам, ориентир времени ответа и нагрузка на менеджеров (mock).
        </p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <GitBranch className="h-8 w-8 text-brand-500" />
            <div>
              <p className="text-xs text-zinc-500">Конверсия в заказ</p>
              <p className="text-2xl font-bold text-zinc-50">{conversion}%</p>
              <p className="text-xs text-zinc-600">
                заказы с привязкой к заявке / все заявки
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-cyan-500" />
            <div>
              <p className="text-xs text-zinc-500">Ср. время до обновления</p>
              <p className="text-2xl font-bold text-zinc-50">
                {avgResponseHours != null ? `${avgResponseHours} ч` : '—'}
              </p>
              <p className="text-xs text-zinc-600">по заявкам не в статусе «Новая»</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-violet-500" />
            <div>
              <p className="text-xs text-zinc-500">Всего заявок</p>
              <p className="text-2xl font-bold text-zinc-50">{funnel.total}</p>
              <p className="text-xs text-zinc-600">цена + sourcing</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-xs text-zinc-500">Активных заказов</p>
              <p className="text-2xl font-bold text-zinc-50">{orders.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <h2 className="mt-10 text-lg font-semibold text-zinc-200">Воронка по статусам</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { k: 'Новая', v: funnel.new },
          { k: 'В обработке', v: funnel.processing },
          { k: 'Найден поставщик', v: funnel.supplierFound },
          { k: 'Производство', v: funnel.production },
          { k: 'Отправлено', v: funnel.shipped },
          { k: 'Завершено', v: funnel.completed },
        ].map((row) => (
          <div
            key={row.k}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-surface-800/60 px-4 py-3"
          >
            <span className="text-sm text-zinc-400">{row.k}</span>
            <span className="text-lg font-semibold text-zinc-100">{row.v}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-zinc-200">
        Назначение и нагрузка
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Открытые заявки (не «Завершено»), назначенные менеджеру
      </p>
      <div className="mt-4">
        <DataTable
          columns={[
            { key: 'name', title: 'Менеджер' },
            { key: 'email', title: 'Email' },
            {
              key: 'assigned',
              title: 'Назначено заявок',
              render: (row) => (
                <span className="font-semibold text-brand-400">{row.assigned}</span>
              ),
            },
          ]}
          rows={workload}
        />
      </div>
    </div>
  );
}
