import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';

/** Mock: проверяем email в локальной базе и показываем «письмо отправлено» */
export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const resetPasswordMock = useAuthStore((s) => s.resetPasswordMock);

  function submit(e) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Введите email');
      return;
    }
    const ok = resetPasswordMock(email);
    if (!ok) {
      toast.error('Аккаунта с таким email нет в демо-базе.');
      return;
    }
    setSent(true);
    toast.success('Инструкция отправлена (mock). Проверьте почту.');
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-zinc-800 bg-surface-800/60 p-8 shadow-card"
      >
        <h1 className="text-2xl font-bold text-zinc-50">Восстановление пароля</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Демо-режим: письмо не отправляется. Если email есть в системе, покажем
          подтверждение.
        </p>
        {!sent ? (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Отправить ссылку
            </Button>
          </form>
        ) : (
          <p className="mt-8 text-sm text-zinc-300">
            Если бы это был продакшен, на <strong>{email}</strong> ушла бы ссылка
            для сброса пароля.
          </p>
        )}
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-brand-400 hover:underline">
            ← Назад ко входу
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
