import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { useOperationsStore } from '../store/operationsStore';

export function AdminDashboard() {
  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const users = useAuthStore((s) => s.users);
  const quoteRequests = useOperationsStore((s) => s.quoteRequests);
  const sourcingRequests = useOperationsStore((s) => s.sourcingRequests);
  const orders = useOperationsStore((s) => s.orders);

  const newQuotes = quoteRequests.filter((r) => r.status === 'new').length;
  const newSourcing = sourcingRequests.filter((r) => r.status === 'new').length;

  const stats = [
    {
      label: 'Товары',
      value: products.length,
      to: '/admin/products',
      icon: Package,
      hint: `${categories.length} категорий`,
    },
    {
      label: 'Пользователи',
      value: users.length,
      to: '/admin/users',
      icon: Users,
      hint: 'в демо-базе',
    },
    {
      label: 'Открытые заявки',
      value: newQuotes + newSourcing,
      to: '/admin/requests',
      icon: ClipboardList,
      hint: 'новые по цене и sourcing',
    },
    {
      label: 'Заказы',
      value: orders.length,
      to: '/admin/orders',
      icon: ShoppingCart,
      hint: 'все статусы',
    },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-zinc-50">Панель управления</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Mock-данные в браузере. Изменения сохраняются в localStorage.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <Link key={s.label} to={s.to}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">{s.label}</p>
                    <p className="mt-2 text-3xl font-bold text-zinc-50">{s.value}</p>
                    <p className="mt-1 text-xs text-zinc-500">{s.hint}</p>
                  </div>
                  <s.icon className="h-10 w-10 text-brand-500/80" />
                </div>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
