import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  ClipboardList,
  CreditCard,
  Heart,
  MessageSquare,
  Package,
  Search,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useOperationsStore } from '../store/operationsStore';
import { formatDate } from '../lib/utils';

export function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const getMessagesForUser = useOperationsStore((s) => s.getMessagesForUser);
  const quoteRequests = useOperationsStore((s) => s.quoteRequests);
  const sourcingRequests = useOperationsStore((s) => s.sourcingRequests);
  const orders = useOperationsStore((s) => s.orders);

  const myQuotes = quoteRequests.filter((r) => r.userId === user?.id);
  const mySourcing = sourcingRequests.filter((r) => r.userId === user?.id);
  const myOrders = orders.filter((o) => o.userId === user?.id);
  const messages = user ? getMessagesForUser(user.id) : [];

  const quick = [
    { to: '/requests', label: 'Мои заявки', icon: ClipboardList, desc: 'Цены и sourcing' },
    { to: '/orders', label: 'Мои заказы', icon: Package, desc: 'Статусы и трекинг' },
    { to: '/messages', label: 'Чат с менеджером', icon: MessageSquare, desc: 'По заявкам и заказам' },
    { to: '/payments', label: 'Платежи', icon: CreditCard, desc: 'Этапы оплаты (mock)' },
    { to: '/favorites', label: 'Избранное', icon: Heart, desc: 'Сохранённые товары' },
    { to: '/sourcing', label: 'Новый sourcing', icon: Search, desc: 'Найти товар' },
    { to: '/cases', label: 'Кейсы по отраслям', icon: Briefcase, desc: 'Сценарии и цифры' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-zinc-50">
          Здравствуйте{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-2 text-zinc-400">
          Краткая сводка по заявкам и сообщениям менеджера. Все детали — в разделах
          ниже.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {quick.map((q) => (
          <Link key={q.to} to={q.to}>
            <Card hover className="h-full p-5">
              <q.icon className="h-8 w-8 text-brand-500" />
              <h2 className="mt-3 font-semibold text-zinc-100">{q.label}</h2>
              <p className="mt-1 text-sm text-zinc-500">{q.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
            <MessageSquare className="h-5 w-5 text-brand-500" />
            Сообщения от менеджера
          </h2>
          <ul className="mt-2 text-xs text-zinc-500">
            <li>
              <Link to="/messages" className="text-brand-400 hover:underline">
                Открыть чаты по заявкам и заказам
              </Link>
            </li>
          </ul>
          <ul className="mt-4 space-y-4">
            {messages.slice(0, 5).map((m) => (
              <li
                key={m.id}
                className="rounded-xl border border-zinc-800 bg-surface-900/50 p-4 text-sm"
              >
                <p className="text-zinc-300">{m.body}</p>
                <p className="mt-2 text-xs text-zinc-500">{formatDate(m.createdAt)}</p>
              </li>
            ))}
            {!messages.length && (
              <p className="text-sm text-zinc-500">Пока нет сообщений.</p>
            )}
          </ul>
          <Link to="/catalog">
            <Button variant="outline" className="mt-4 w-full" size="sm">
              Перейти в каталог
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-100">Сводка</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-zinc-800 py-2">
              <dt className="text-zinc-500">Заявки на цену</dt>
              <dd className="font-medium text-zinc-200">{myQuotes.length}</dd>
            </div>
            <div className="flex justify-between border-b border-zinc-800 py-2">
              <dt className="text-zinc-500">Sourcing-запросы</dt>
              <dd className="font-medium text-zinc-200">{mySourcing.length}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-zinc-500">Заказы</dt>
              <dd className="font-medium text-zinc-200">{myOrders.length}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
