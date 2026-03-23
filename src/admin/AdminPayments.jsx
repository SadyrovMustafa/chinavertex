import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Check, Image, X, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DataTable } from '../components/ui/DataTable';
import { useOperationsStore } from '../store/operationsStore';
import { useAdminDataStore } from '../store/adminDataStore';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../lib/utils';
import { cn } from '../lib/utils';

const statusMeta = {
  paid: { label: 'Оплачено', className: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300' },
  pending: { label: 'К оплате', className: 'border-amber-500/40 bg-amber-500/15 text-amber-300' },
};

export function AdminPayments() {
  const payments = useOperationsStore((s) => s.payments);
  const updatePayment = useOperationsStore((s) => s.updatePayment);
  const orders = useOperationsStore((s) => s.orders);
  const users = useAuthStore((s) => s.users);

  const cryptoSettings = useAdminDataStore((s) => s.cryptoSettings) || {};
  const updateCryptoSettings = useAdminDataStore((s) => s.updateCryptoSettings);

  const [wallet, setWallet] = useState(cryptoSettings.usdtTrc20Wallet || '');
  const [savingWallet, setSavingWallet] = useState(false);
  const [receiptModal, setReceiptModal] = useState(null);

  const userEmail = (id) => users.find((u) => u.id === id)?.email ?? id;
  const orderTitle = (id) => orders.find((o) => o.id === id)?.title ?? id ?? '—';

  const saveWallet = () => {
    const trimmed = wallet.trim();
    if (!trimmed) {
      toast.error('Укажите адрес кошелька');
      return;
    }
    setSavingWallet(true);
    updateCryptoSettings({ usdtTrc20Wallet: trimmed });
    setSavingWallet(false);
    toast.success('Адрес кошелька сохранён');
  };

  const confirmPaid = (paymentId) => {
    updatePayment(paymentId, { status: 'paid' });
    toast.success('Оплата подтверждена');
    setReceiptModal(null);
  };

  return (
    <div>
      <div className="mb-8 rounded-2xl border border-zinc-700 bg-surface-800/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              USDT TRC20 — адрес для приёма
            </h2>
            <p className="text-sm text-zinc-400">
              Клиенты видят этот адрес при оплате криптой
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Input
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="T... (ваш TRC20 адрес)"
            className="flex-1 font-mono text-sm"
          />
          <Button
            onClick={saveWallet}
            disabled={savingWallet || wallet === cryptoSettings.usdtTrc20Wallet}
          >
            Сохранить
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Платежи и чеки</h1>
        <p className="text-sm text-zinc-400">
          Чеки USDT TRC20 от клиентов. Подтвердите оплату после проверки.
        </p>
      </div>

      <div className="mt-6">
        <DataTable
          emptyText="Платежей пока нет"
          columns={[
            { key: 'title', title: 'Платёж' },
            {
              key: 'userId',
              title: 'Клиент',
              render: (row) => (
                <span className="text-xs">{userEmail(row.userId)}</span>
              ),
            },
            {
              key: 'orderId',
              title: 'Заказ',
              render: (row) => (
                <span className="text-xs text-zinc-400">
                  {orderTitle(row.orderId)}
                </span>
              ),
            },
            {
              key: 'amountUsd',
              title: 'Сумма',
              render: (row) => (
                <span className="font-medium text-brand-400">
                  ${row.amountUsd.toLocaleString('ru-RU')}
                </span>
              ),
            },
            {
              key: 'status',
              title: 'Статус',
              render: (row) => {
                const st = statusMeta[row.status] || statusMeta.pending;
                return (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs',
                      st.className
                    )}
                  >
                    {row.receiptDataUrl && (
                      <Image className="h-3.5 w-3.5" />
                    )}
                    {st.label}
                  </span>
                );
              },
            },
            {
              key: 'createdAt',
              title: 'Дата',
              render: (row) => formatDate(row.createdAt),
            },
            {
              key: 'actions',
              title: '',
              render: (row) =>
                row.receiptDataUrl ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setReceiptModal(row)}
                  >
                    Чек
                  </Button>
                ) : (
                  <span className="text-xs text-zinc-500">—</span>
                ),
            },
          ]}
          rows={payments}
        />
      </div>

      <AnimatePresence>
        {receiptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
            onClick={() => setReceiptModal(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-700 bg-surface-800 p-6"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold text-zinc-100">
                  Чек об оплате — {receiptModal.title}
                </h2>
                <button
                  type="button"
                  onClick={() => setReceiptModal(null)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-surface-700 hover:text-zinc-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                Клиент: {userEmail(receiptModal.userId)} ·{' '}
                ${receiptModal.amountUsd.toLocaleString('ru-RU')} ·{' '}
                {formatDate(receiptModal.createdAt)}
              </p>
              <div className="mt-4 overflow-hidden rounded-xl border border-zinc-700 bg-surface-900">
                <img
                  src={receiptModal.receiptDataUrl}
                  alt="Чек об оплате"
                  className="max-h-[60vh] w-full object-contain"
                />
              </div>
              <div className="mt-4 flex gap-3">
                <a
                  href={receiptModal.receiptDataUrl}
                  download={`receipt-${receiptModal.id}.png`}
                  className="inline-flex"
                >
                  <Button variant="secondary">
                    <Copy className="mr-2 h-4 w-4" />
                    Скачать
                  </Button>
                </a>
                {receiptModal.status === 'pending' && (
                  <Button onClick={() => confirmPaid(receiptModal.id)}>
                    <Check className="mr-2 h-4 w-4" />
                    Подтвердить оплату
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
