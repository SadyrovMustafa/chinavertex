import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Wallet, Upload, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/Button';
import { useOperationsStore } from '../store/operationsStore';
import { useAdminDataStore } from '../store/adminDataStore';

const USDT_TRC20 = 'USDT TRC20';

export function CryptoPaymentModal({ payment, onClose }) {
  const [receiptFile, setReceiptFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const updatePayment = useOperationsStore((s) => s.updatePayment);
  const usdtWallet = useAdminDataStore((s) => s.cryptoSettings?.usdtTrc20Wallet) || '';

  if (!payment || !usdtWallet) return null;

  const amountUsdt = payment.amountUsd.toFixed(2);
  const memo = `ChinaVertex ${payment.id}`;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success(`${label} скопировано`),
      () => toast.error('Не удалось скопировать')
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Загрузите изображение (PNG, JPG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Максимум 5 МБ');
      return;
    }
    setReceiptFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const handleSubmit = () => {
    if (!receiptFile) {
      toast.error('Загрузите скриншот чека об оплате');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updatePayment(payment.id, {
        paymentMethod: 'usdt_trc20',
        receiptDataUrl: reader.result,
        status: 'pending',
      });
      toast.success('Чек отправлен. Ожидайте подтверждения оплаты.');
      onClose();
    };
    reader.readAsDataURL(receiptFile);
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-700 bg-surface-800 p-6 shadow-card"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                Оплата {USDT_TRC20}
              </h2>
              <p className="text-sm text-zinc-400">{payment.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-surface-700 hover:text-zinc-100"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div className="rounded-xl border border-zinc-700 bg-surface-900/50 p-4">
            <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
              Сумма к оплате
            </p>
            <p className="text-2xl font-bold text-emerald-400">{amountUsdt} USDT</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Адрес кошелька (TRC20)
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-surface-900/50 p-3">
              <code className="flex-1 break-all text-sm text-zinc-300">
                {usdtWallet}
              </code>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => copyToClipboard(usdtWallet, 'Адрес')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Мемо (обязательно укажите при переводе)
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-surface-900/50 p-3">
              <code className="flex-1 break-all text-sm text-zinc-300">{memo}</code>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => copyToClipboard(memo, 'Мемо')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="rounded-lg bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Переведите <strong>{amountUsdt} USDT</strong> на сеть TRC20, затем
            загрузите скриншот чека об оплате ниже.
          </p>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Скриншот чека об оплате
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {!previewUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-600 py-8 text-zinc-400 transition hover:border-brand-500/50 hover:text-brand-400"
              >
                <Upload className="h-10 w-10" />
                <span>Нажмите или перетащите изображение</span>
                <span className="text-xs">PNG, JPG, WebP до 5 МБ</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="relative overflow-hidden rounded-xl border border-zinc-700">
                  <img
                    src={previewUrl}
                    alt="Чек"
                    className="max-h-48 w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveReceipt}
                    className="absolute right-2 top-2 rounded-lg bg-red-500/90 p-1.5 text-white hover:bg-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Заменить изображение
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Отмена
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={!receiptFile}
          >
            <Check className="mr-2 h-4 w-4" />
            Отправить чек
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
