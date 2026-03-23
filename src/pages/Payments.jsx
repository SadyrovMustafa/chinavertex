import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Wallet } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useOperationsStore } from '../store/operationsStore';
import { CryptoPaymentModal } from '../components/CryptoPaymentModal';
import { formatDate } from '../lib/utils';
import { cn } from '../lib/utils';

const statusMeta = {
  paid: { label: 'Оплачено', className: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300' },
  pending: { label: 'К оплате', className: 'border-amber-500/40 bg-amber-500/15 text-amber-300' },
  overdue: { label: 'Просрочено', className: 'border-red-500/40 bg-red-500/15 text-red-300' },
};

export function Payments() {
  const user = useAuthStore((s) => s.user);
  const payments = useOperationsStore((s) => s.payments);
  const orders = useOperationsStore((s) => s.orders);
  const [cryptoPayment, setCryptoPayment] = useState(null);

  const list = useMemo(
    () =>
      payments
        .filter((p) => p.userId === user?.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [payments, user?.id]
  );

  const orderTitle = (orderId) =>
    orders.find((o) => o.id === orderId)?.title ?? orderId ?? '—';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600/20 text-brand-400">
          <CreditCard className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">Платежи</h1>
          <p className="mt-2 text-zinc-400">
            Mock-история этапов оплаты по заказам. В продакшене здесь будут статусы
            из банка или платёжного провайдера.
          </p>
        </div>
      </motion.div>

      <div className="mt-10 space-y-4">
        {list.map((p) => {
          const st = statusMeta[p.status] || statusMeta.pending;
          const isPending = p.status === 'pending';
          const hasReceipt = !!p.receiptDataUrl;
          return (
            <Card key={p.id} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-zinc-100">{p.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Заказ: {orderTitle(p.orderId)}
                    {p.stage && ` · этап: ${p.stage}`}
                  </p>
                  <p className="mt-2 text-xs text-zinc-600">
                    Создан: {formatDate(p.createdAt)}
                    {p.paidAt && ` · оплачен: ${formatDate(p.paidAt)}`}
                    {p.paymentMethod === 'usdt_trc20' && ' · USDT TRC20'}
                    {hasReceipt && isPending && ' · чек отправлен'}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <p className="text-xl font-bold text-brand-400">
                    ${p.amountUsd.toLocaleString('ru-RU')}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {isPending && (
                      <Button
                        size="sm"
                        onClick={() => setCryptoPayment(p)}
                      >
                        <Wallet className="mr-1.5 h-4 w-4" />
                        Оплатить USDT TRC20
                      </Button>
                    )}
                    <Badge className={cn('border', st.className)}>{st.label}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {!list.length && (
        <p className="py-16 text-center text-zinc-500">Платежей пока нет.</p>
      )}

      <AnimatePresence>
        {cryptoPayment && (
          <CryptoPaymentModal
            payment={cryptoPayment}
            onClose={() => setCryptoPayment(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
