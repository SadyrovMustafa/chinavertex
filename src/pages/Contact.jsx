import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState({});

  function submit(e) {
    e.preventDefault();
    const er = {};
    if (!name.trim()) er.name = 'Укажите имя';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) er.email = 'Некорректный email';
    if (!msg.trim()) er.msg = 'Введите сообщение';
    setErrors(er);
    if (Object.keys(er).length) return;
    toast.success('Сообщение принято. Мы ответим на указанную почту в течение одного рабочего дня.');
    setName('');
    setEmail('');
    setMsg('');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-zinc-50">Связаться с нами</h1>
          <p className="mt-4 text-zinc-400">
            Оставьте заявку на консультацию или опишите задачу — менеджер ChinaVertex
            подключится из офиса в Шэньчжэне и предложит следующий шаг.
          </p>
          <div className="mt-10 space-y-6 text-sm text-zinc-300">
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-brand-500" />
              <div>
                <p className="font-medium text-zinc-200">Email</p>
                <a href="mailto:hello@chinvertex.com" className="text-brand-400 hover:underline">
                  hello@chinvertex.com
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <MessageSquare className="mt-0.5 h-5 w-5 text-brand-500" />
              <div>
                <p className="font-medium text-zinc-200">Мессенджеры</p>
                <p>WeChat / WhatsApp: укажите в форме предпочтительный канал</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={submit}
          className="rounded-2xl border border-zinc-800 bg-surface-800/60 p-6 shadow-card md:p-8"
        >
          <Input
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <div className="mt-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Сообщение"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              error={errors.msg}
            />
          </div>
          <Button type="submit" className="mt-6 w-full">
            Отправить
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
