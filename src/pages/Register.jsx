import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';

export function Register() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    const er = {};
    if (!name.trim()) er.name = 'Укажите имя';
    if (!email.trim()) er.email = 'Введите email';
    if (password.length < 6) er.password = 'Минимум 6 символов';
    setErrors(er);
    if (Object.keys(er).length) return;
    const res = register({
      name,
      company,
      email: email.trim(),
      password,
    });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success('Аккаунт создан. Добро пожаловать!');
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-zinc-800 bg-surface-800/60 p-8 shadow-card"
      >
        <h1 className="text-2xl font-bold text-zinc-50">Регистрация</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Создайте B2B-аккаунт для заявок, заказов и переписки с менеджером.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <Input
            label="Имя и фамилия"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <Input
            label="Компания (необязательно)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <Button type="submit" className="w-full">
            Зарегистрироваться
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-brand-400 hover:underline">
            Вход
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
