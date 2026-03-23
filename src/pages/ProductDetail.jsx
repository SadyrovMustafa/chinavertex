import { useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, FileText, ImageUp, Send, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { useOperationsStore } from '../store/operationsStore';
import { ROLES, CRYPTO_USDT_TRC20_ADDRESS } from '../lib/constants';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useCatalogStore((s) => s.products.find((p) => p.id === id));
  const category = useCatalogStore((s) =>
    s.categories.find((c) => c.id === product?.categoryId)
  );
  const user = useAuthStore((s) => s.user);
  const addQuoteRequest = useOperationsStore((s) => s.addQuoteRequest);

  const [open, setOpen] = useState(false);
  const [openBuy, setOpenBuy] = useState(false);
  const [qty, setQty] = useState('');
  const [comment, setComment] = useState('');
  const [link, setLink] = useState('');
  const [errors, setErrors] = useState({});
  const [buyQty, setBuyQty] = useState('');
  const [screenshotDataUrl, setScreenshotDataUrl] = useState(null);
  const fileInputRef = useRef(null);
  const addOrderWithCryptoPayment = useOperationsStore((s) => s.addOrderWithCryptoPayment);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-zinc-400">Товар не найден.</p>
        <Link to="/catalog" className="mt-4 inline-block text-brand-400 hover:underline">
          В каталог
        </Link>
      </div>
    );
  }

  function validate() {
    const e = {};
    const n = Number(qty);
    if (!qty || Number.isNaN(n) || n < 1) e.qty = 'Укажите количество';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateBuy() {
    const e = {};
    const n = Number(buyQty);
    if (!buyQty || Number.isNaN(n) || n < (product?.moq || 1))
      e.buyQty = `Мин. количество ${product?.moq || 1} шт.`;
    if (!screenshotDataUrl) e.screenshot = 'Загрузите скриншот об оплате';
    setErrors((prev) => ({ ...prev, ...e }));
    return Object.keys(e).length === 0;
  }

  function copyAddress() {
    if (CRYPTO_USDT_TRC20_ADDRESS.startsWith('T')) {
      navigator.clipboard.writeText(CRYPTO_USDT_TRC20_ADDRESS);
      toast.success('Адрес скопирован в буфер обмена');
    }
  }

  function handleScreenshotChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Выберите изображение (PNG, JPG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setScreenshotDataUrl(reader.result);
    reader.readAsDataURL(file);
  }

  function submitBuy(e) {
    e.preventDefault();
    if (!user) {
      toast.error('Войдите в аккаунт для оформления заказа.');
      navigate('/login', { state: { from: { pathname: `/product/${id}` } } });
      return;
    }
    if (user.role !== ROLES.CLIENT) {
      toast.error('Заказы доступны клиентским аккаунтам.');
      return;
    }
    if (!validateBuy()) return;
    const amount = (product.priceUsd * Number(buyQty)).toFixed(2);
    const title = `${product.name} × ${buyQty}`;
    const itemsSummary = `${product.name}, ${buyQty} шт., ${amount} USDT`;
    addOrderWithCryptoPayment({
      userId: user.id,
      title,
      itemsSummary,
      productId: product.id,
      quantity: Number(buyQty),
      amountUsd: amount,
      paymentTitle: `Оплата USDT (TRC20) — ${title}`,
      receiptDataUrl: screenshotDataUrl,
    });
    toast.success('Заказ оформлен. Менеджер проверит платёж и свяжется с вами.');
    setOpenBuy(false);
    setBuyQty('');
    setScreenshotDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function submit(e) {
    e.preventDefault();
    if (!user) {
      toast.error('Войдите в аккаунт, чтобы отправить заявку.');
      navigate('/login', { state: { from: { pathname: `/product/${id}` } } });
      return;
    }
    if (user.role !== ROLES.CLIENT) {
      toast.error('Заявки доступны клиентским аккаунтам.');
      return;
    }
    if (!validate()) return;
    addQuoteRequest({
      userId: user.id,
      productId: product.id,
      productName: product.name,
      quantity: Number(qty),
      comment,
      attachmentNote: link,
    });
    toast.success('Заявка отправлена. Менеджер свяжется с вами в рабочее время.');
    setOpen(false);
    setQty('');
    setComment('');
    setLink('');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" /> Назад в каталог
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-zinc-800 bg-surface-800/50"
        >
          <img
            src={product.image}
            alt=""
            className="aspect-square w-full object-cover"
          />
        </motion.div>

        <div>
          {category && (
            <span className="text-sm font-medium text-brand-400">{category.name}</span>
          )}
          <h1 className="mt-2 text-3xl font-bold text-zinc-50">{product.name}</h1>
          <p className="mt-6 leading-relaxed text-zinc-400">{product.description}</p>
          <div className="mt-8 flex flex-wrap gap-6 border-y border-zinc-800 py-6">
            <div>
              <p className="text-xs uppercase text-zinc-500">Ориентир цены</p>
              <p className="text-3xl font-bold text-brand-400">
                ${product.priceUsd.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-zinc-500">MOQ</p>
              <p className="text-2xl font-semibold text-zinc-200">{product.moq} шт.</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" onClick={() => setOpenBuy(true)}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Купить (USDT TRC20)
            </Button>
            <Button size="lg" variant="outline" onClick={() => setOpen(true)}>
              <FileText className="mr-2 h-5 w-5" />
              Запросить цену
            </Button>
            <Link to="/sourcing">
              <Button size="lg" variant="outline">
                Найти аналог / sourcing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 sm:items-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-700 bg-surface-800 p-6 shadow-card"
            >
              <h2 className="text-lg font-semibold text-zinc-100">
                Заявка на «{product.name}»
              </h2>
              <form onSubmit={submit} className="mt-6 space-y-4">
                <Input
                  label="Количество (шт.)"
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  error={errors.qty}
                />
                <Textarea
                  label="Комментарий"
                  placeholder="Пожелания по упаковке, сертификатам, срокам"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Input
                  label="Ссылка на файл или референс (необязательно)"
                  placeholder="https://…"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Отправить заявку
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
        {openBuy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 sm:items-center"
            onClick={() => setOpenBuy(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-700 bg-surface-800 p-6 shadow-card"
            >
              <h2 className="text-lg font-semibold text-zinc-100">
                Оформление заказа — оплата USDT (TRC20)
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Переведите сумму на указанный адрес и загрузите скриншот об оплате.
              </p>
              <form onSubmit={submitBuy} className="mt-6 space-y-4">
                <Input
                  label="Количество (шт.)"
                  type="number"
                  min={product?.moq || 1}
                  value={buyQty}
                  onChange={(e) => setBuyQty(e.target.value)}
                  error={errors.buyQty}
                  placeholder={`Мин. ${product?.moq || 1}`}
                />
                {buyQty && (
                  <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4">
                    <p className="text-sm text-zinc-500">Сумма к оплате</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      ${(product.priceUsd * Number(buyQty)).toFixed(2)} USDT
                    </p>
                  </div>
                )}
                <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4">
                  <p className="mb-2 text-sm text-zinc-500">Адрес кошелька USDT (TRC20)</p>
                  {CRYPTO_USDT_TRC20_ADDRESS.includes('ReplaceMe') && (
                    <p className="mb-2 text-xs text-amber-400">
                      Владелец сайта должен указать адрес в src/lib/constants.js
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <code className="flex-1 break-all text-sm text-zinc-300">
                      {CRYPTO_USDT_TRC20_ADDRESS}
                    </code>
                    {CRYPTO_USDT_TRC20_ADDRESS.startsWith('T') &&
                      !CRYPTO_USDT_TRC20_ADDRESS.includes('ReplaceMe') && (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={copyAddress}
                        title="Скопировать"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Скриншот об оплате <span className="text-red-400">*</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleScreenshotChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageUp className="mr-2 h-4 w-4" />
                    {screenshotDataUrl ? 'Скриншот загружен' : 'Выберите файл'}
                  </Button>
                  {screenshotDataUrl && (
                    <img
                      src={screenshotDataUrl}
                      alt="Скриншот"
                      className="mt-2 max-h-32 rounded-lg border border-zinc-700 object-contain"
                    />
                  )}
                  {errors.screenshot && (
                    <p className="mt-1 text-sm text-red-400">{errors.screenshot}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Оформить заказ
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
