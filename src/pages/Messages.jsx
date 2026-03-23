import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useOperationsStore } from '../store/operationsStore';
import { formatDate } from '../lib/utils';
import { cn } from '../lib/utils';

export function Messages() {
  const user = useAuthStore((s) => s.user);
  const quoteRequests = useOperationsStore((s) => s.quoteRequests);
  const sourcingRequests = useOperationsStore((s) => s.sourcingRequests);
  const orders = useOperationsStore((s) => s.orders);
  const threadMessages = useOperationsStore((s) => s.threadMessages);
  const addThreadMessage = useOperationsStore((s) => s.addThreadMessage);

  const [selected, setSelected] = useState(null);
  const [text, setText] = useState('');

  const threads = useMemo(() => {
    if (!user?.id) return [];
    const t = [];
    quoteRequests
      .filter((r) => r.userId === user.id)
      .forEach((r) =>
        t.push({
          contextType: 'quote',
          contextId: r.id,
          label: `Цена: ${r.productName?.slice(0, 42)}…`,
        })
      );
    sourcingRequests
      .filter((r) => r.userId === user.id)
      .forEach((r) =>
        t.push({
          contextType: 'sourcing',
          contextId: r.id,
          label: `Sourcing: ${(r.description || r.productUrl || '').slice(0, 40)}…`,
        })
      );
    orders
      .filter((o) => o.userId === user.id)
      .forEach((o) =>
        t.push({
          contextType: 'order',
          contextId: o.id,
          label: `Заказ: ${o.title?.slice(0, 44)}…`,
        })
      );
    return t;
  }, [user?.id, quoteRequests, sourcingRequests, orders]);

  const messages = useMemo(() => {
    if (!selected) return [];
    return threadMessages
      .filter(
        (m) =>
          m.contextType === selected.contextType &&
          m.contextId === selected.contextId
      )
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [threadMessages, selected]);

  function send() {
    if (!user || !selected || !text.trim()) return;
    addThreadMessage({
      userId: user.id,
      contextType: selected.contextType,
      contextId: selected.contextId,
      from: 'client',
      body: text,
    });
    setText('');
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:flex-row lg:px-8">
      <motion.aside
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full shrink-0 rounded-2xl border border-zinc-800 bg-surface-800/60 lg:w-72"
      >
        <div className="border-b border-zinc-800 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <MessageSquare className="h-4 w-4 text-brand-500" />
            Диалоги
          </h2>
          <p className="mt-1 text-xs text-zinc-500">По заявкам и заказам</p>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2 lg:max-h-[calc(100vh-12rem)]">
          {threads.map((th) => {
            const active =
              selected?.contextType === th.contextType &&
              selected?.contextId === th.contextId;
            return (
              <li key={`${th.contextType}-${th.contextId}`}>
                <button
                  type="button"
                  onClick={() => setSelected(th)}
                  className={cn(
                    'mb-1 w-full rounded-xl px-3 py-2.5 text-left text-xs transition',
                    active
                      ? 'bg-brand-600/25 text-brand-100'
                      : 'text-zinc-400 hover:bg-surface-700 hover:text-zinc-200'
                  )}
                >
                  {th.label}
                </button>
              </li>
            );
          })}
        </ul>
        {!threads.length && (
          <p className="p-4 text-xs text-zinc-500">Нет заявок для чата.</p>
        )}
      </motion.aside>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[420px] flex-1 flex-col rounded-2xl border border-zinc-800 bg-surface-800/40"
      >
        {!selected ? (
          <div className="flex flex-1 items-center justify-center p-8 text-sm text-zinc-500">
            Выберите заявку или заказ слева
          </div>
        ) : (
          <>
            <div className="border-b border-zinc-800 p-4">
              <p className="text-sm font-medium text-zinc-200">{selected.label}</p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                    m.from === 'client'
                      ? 'ml-auto bg-brand-600/25 text-zinc-100'
                      : 'bg-surface-700 text-zinc-200'
                  )}
                >
                  <p>{m.body}</p>
                  <p className="mt-1 text-[10px] text-zinc-500">
                    {m.from === 'client' ? 'Вы' : 'Менеджер'} ·{' '}
                    {formatDate(m.createdAt)}
                  </p>
                </div>
              ))}
              {!messages.length && (
                <p className="text-center text-sm text-zinc-500">
                  Сообщений пока нет — напишите менеджеру.
                </p>
              )}
            </div>
            <div className="border-t border-zinc-800 p-4">
              <div className="flex gap-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Сообщение…"
                  rows={2}
                  className="min-h-[44px] flex-1 resize-none rounded-xl border border-zinc-700 bg-surface-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600"
                />
                <Button type="button" className="self-end" onClick={send}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
