import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { ROLES } from '../lib/constants';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  function submit(e) {
    e.preventDefault();
    const er = {};
    if (!email.trim()) er.email = 'Введите email';
    if (!password) er.password = 'Введите пароль';
    setErrors(er);
    if (Object.keys(er).length) return;
    const res = login(email.trim(), password);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success('Добро пожаловать!');
    const u = useAuthStore.getState().user;
    if (u?.role === ROLES.ADMIN || u?.role === ROLES.MANAGER) {
      navigate('/admin', { replace: true });
    } else {
      navigate(from === '/login' ? '/dashboard' : from, { replace: true });
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-zinc-800 bg-surface-800/60 p-8 shadow-card"
      >
        <h1 className="text-2xl font-bold text-zinc-50">Вход</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Демо: <span className="text-zinc-300">client@demo.com</span> /{' '}
          <span className="text-zinc-300">demo123</span>
          {' · '}
          <span className="text-zinc-300">admin@chinvertex.demo</span> /{' '}
          <span className="text-zinc-300">admin123</span>
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Input
            label="Пароль"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-brand-400 hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>
          <Button type="submit" className="w-full">
            Войти
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-brand-400 hover:underline">
            Регистрация
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
