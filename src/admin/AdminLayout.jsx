import { NavLink, Outlet } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  ClipboardList,
  CreditCard,
  FileText,
  FolderTree,
  LayoutDashboard,
  Package,
  Shield,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { cn } from '../lib/utils';

const items = [
  { to: '/admin', end: true, label: 'Обзор', icon: LayoutDashboard },
  { to: '/admin/analytics', label: 'Аналитика', icon: BarChart3 },
  { to: '/admin/products', label: 'Товары', icon: Package },
  { to: '/admin/categories', label: 'Категории', icon: FolderTree },
  { to: '/admin/users', label: 'Пользователи', icon: Users },
  { to: '/admin/requests', label: 'Заявки', icon: ClipboardList },
  { to: '/admin/orders', label: 'Заказы', icon: ShoppingCart },
  { to: '/admin/payments', label: 'Платежи', icon: CreditCard },
  { to: '/admin/templates', label: 'Шаблоны', icon: FileText },
  { to: '/admin/suppliers', label: 'Поставщики', icon: Building2 },
];

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-surface-900">
      <aside className="hidden w-60 shrink-0 border-r border-zinc-800 bg-surface-800/50 lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-5">
          <Shield className="h-6 w-6 text-brand-500" />
          <span className="font-semibold text-zinc-100">ChinaVertex Admin</span>
        </div>
        <nav className="space-y-1 p-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand-600/20 text-brand-300'
                    : 'text-zinc-400 hover:bg-surface-700 hover:text-zinc-100'
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center border-b border-zinc-800 px-4 lg:hidden">
          <span className="font-semibold text-zinc-100">Админка</span>
        </header>
        <div className="border-b border-zinc-800 bg-surface-800/30 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto px-2 py-2">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium',
                    isActive ? 'bg-brand-600 text-white' : 'bg-surface-700 text-zinc-300'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
