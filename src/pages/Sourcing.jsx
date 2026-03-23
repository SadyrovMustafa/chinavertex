import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, Link2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useAuthStore } from '../store/authStore';
import { useOperationsStore } from '../store/operationsStore';
import { ROLES } from '../lib/constants';

export function Sourcing() {
  const user = useAuthStore((s) => s.user);
  const addSourcingRequest = useOperationsStore((s) => s.addSourcingRequest);
  const navigate = useNavigate();

  const [productUrl, setProductUrl] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Загрузите изображение');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }

  function validate() {
    const er = {};
    if (!description.trim() && !productUrl.trim()) {
      er.desc = 'Укажите ссылку или описание';
    }
    const n = Number(quantity);
    if (!quantity || Number.isNaN(n) || n < 1) er.qty = 'Укажите количество';
    setErrors(er);
    return Object.keys(er).length === 0;
  }

  function submit(e) {
    e.preventDefault();
    if (!user) {
      toast.error('Войдите, чтобы отправить запрос.');
      navigate('/login');
      return;
    }
    if (user.role !== ROLES.CLIENT) {
      toast.error('Отправка доступна только клиентским B2B-аккаунтам.');
      return;
    }
    if (!validate()) return;
    addSourcingRequest({
      userId: user.id,
      productUrl,
      description,
      quantity: Number(quantity),
      imageDataUrl: preview,
    });
    toast.success('Запрос принят. Менеджер свяжется для уточнений.');
    setProductUrl('');
    setDescription('');
    setQuantity('');
    setPreview(null);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-zinc-50">Sourcing-запрос</h1>
        <p className="mt-3 text-zinc-400">
          Пришлите фото, ссылку на маркетплейс и желаемое количество — мы найдём
          фабрику или аналог, согласуем цену и сроки.
        </p>
      </motion.div>

      {!user && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
          Чтобы отправить запрос, войдите в аккаунт клиента или зарегистрируйтесь.
        </p>
      )}
      <form
        onSubmit={submit}
        className="mt-10 space-y-6 rounded-2xl border border-zinc-800 bg-surface-800/60 p-6 shadow-card md:p-8"
      >
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
            <ImagePlus className="h-4 w-4 text-brand-500" />
            Фото образца или референса
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
          />
          {preview && (
            <img
              src={preview}
              alt=""
              className="mt-4 max-h-48 rounded-xl border border-zinc-700 object-contain"
            />
          )}
        </div>

        <div className="relative">
          <Input
            label="Ссылка на товар"
            placeholder="https://1688.com / Amazon / и т.д."
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
          />
          <Link2 className="pointer-events-none absolute right-3 top-9 h-4 w-4 text-zinc-500" />
        </div>

        <Textarea
          label="Описание задачи"
          placeholder="Материал, размеры, сертификаты, пожелания по брендированию"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.desc}
        />

        <Input
          label="Количество (шт.)"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          error={errors.qty}
        />

        <Button type="submit" className="w-full">
          <Send className="mr-2 h-4 w-4" />
          Отправить запрос
        </Button>
      </form>
    </div>
  );
}
