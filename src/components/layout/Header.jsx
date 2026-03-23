import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Menu, MessageSquare, X, LayoutDashboard, LogIn, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { ROLES } from '../../lib/constants';
import { cn } from '../../lib/utils';

const nav = [
  { to: '/catalog', label: 'Каталог' },
  { to: '/cases', label: 'Кейсы' },
  { to: '/sourcing', label: 'Sourcing' },
  { to: '/services', label: 'Услуги' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Контакты' },
];

const linkClass = ({ isActive }) =>
  cn(
    'text-sm font-medium transition',
    isActive ? 'text-brand-400' : 'text-zinc-400 hover:text-zinc-100'
  );

export function Header() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-surface-900/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white shadow-glow">
            CV
          </span>
          <span className="text-lg font-semibold tracking-tight">ChinaVertex</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          {user?.role === ROLES.CLIENT && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Кабинет
              </NavLink>
              <NavLink to="/messages" className={linkClass}>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" /> Чат
                </span>
              </NavLink>
              <NavLink to="/payments" className={linkClass}>
                <span className="inline-flex items-center gap-1">
                  <CreditCard className="h-4 w-4" /> Платежи
                </span>
              </NavLink>
              <NavLink to="/favorites" className={linkClass}>
                Избранное
              </NavLink>
            </>
          )}
          {(user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER) && (
            <NavLink to="/admin" className={linkClass}>
              <span className="inline-flex items-center gap-1">
                <Shield className="h-4 w-4" /> Админка
              </span>
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="max-w-[160px] truncate text-sm text-zinc-400">
                {user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Выход
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="mr-1.5 h-4 w-4" />
                  Вход
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Регистрация</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-zinc-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-zinc-800 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-surface-800"
                >
                  {item.label}
                </NavLink>
              ))}
              {user?.role === ROLES.CLIENT && (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface-800"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Кабинет
                  </NavLink>
                  <NavLink
                    to="/messages"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm hover:bg-surface-800"
                  >
                    Чат с менеджером
                  </NavLink>
                  <NavLink
                    to="/payments"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm hover:bg-surface-800"
                  >
                    Платежи
                  </NavLink>
                  <NavLink
                    to="/favorites"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm hover:bg-surface-800"
                  >
                    Избранное
                  </NavLink>
                </>
              )}
              {(user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER) && (
                <NavLink
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm hover:bg-surface-800"
                >
                  Админка
                </NavLink>
              )}
              {user ? (
                <Button variant="secondary" className="mt-2" onClick={() => { logout(); setOpen(false); }}>
                  Выход
                </Button>
              ) : (
                <div className="mt-2 flex gap-2">
                  <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full">Вход</Button>
                  </Link>
                  <Link to="/register" className="flex-1" onClick={() => setOpen(false)}>
                    <Button className="w-full">Регистрация</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
