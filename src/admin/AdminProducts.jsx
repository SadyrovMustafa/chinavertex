import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { DataTable } from '../components/ui/DataTable';
import { useCatalogStore } from '../store/catalogStore';
import { useAdminDataStore } from '../store/adminDataStore';

const emptyForm = {
  name: '',
  description: '',
  priceUsd: '',
  moq: '',
  categoryId: '',
  supplierId: '',
  image: '',
};

export function AdminProducts() {
  const categories = useCatalogStore((s) => s.categories);
  const products = useCatalogStore((s) => s.products);
  const priceHistory = useCatalogStore((s) => s.priceHistory);
  const addProduct = useCatalogStore((s) => s.addProduct);
  const updateProduct = useCatalogStore((s) => s.updateProduct);
  const bulkUpdateProducts = useCatalogStore((s) => s.bulkUpdateProducts);
  const deleteProduct = useCatalogStore((s) => s.deleteProduct);
  const suppliers = useAdminDataStore((s) => s.suppliers);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [bulkCategoryId, setBulkCategoryId] = useState('all');
  const [bulkSupplierId, setBulkSupplierId] = useState('all');
  const [bulkPriceMode, setBulkPriceMode] = useState('set');
  const [bulkPriceValue, setBulkPriceValue] = useState('');
  const [bulkMoqMode, setBulkMoqMode] = useState('set');
  const [bulkMoqValue, setBulkMoqValue] = useState('');
  const csvInputRef = useRef(null);

  function openCreate() {
    setEditing(null);
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id || '',
      supplierId: suppliers[0]?.id || '',
    });
    setErrors({});
    setOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      priceUsd: String(p.priceUsd),
      moq: String(p.moq),
      categoryId: p.categoryId,
      supplierId: p.supplierId || '',
      image: p.image,
    });
    setErrors({});
    setOpen(true);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Название';
    if (!form.description.trim()) e.description = 'Описание';
    const price = Number(form.priceUsd);
    const moq = Number(form.moq);
    if (Number.isNaN(price) || price <= 0) e.priceUsd = 'Цена';
    if (Number.isNaN(moq) || moq < 1) e.moq = 'MOQ';
    if (!form.categoryId) e.categoryId = 'Категория';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function save(e) {
    e.preventDefault();
    if (!validate()) return;
    if (editing) {
      updateProduct(editing.id, {
        name: form.name,
        description: form.description,
        priceUsd: Number(form.priceUsd),
        moq: Number(form.moq),
        categoryId: form.categoryId,
        supplierId: form.supplierId,
        image: form.image.trim() || editing.image,
      }, { source: 'manual', note: 'Из карточки товара' });
      toast.success('Товар обновлён');
    } else {
      addProduct({
        name: form.name,
        description: form.description,
        priceUsd: form.priceUsd,
        moq: form.moq,
        categoryId: form.categoryId,
        supplierId: form.supplierId,
        image: form.image,
      });
      toast.success('Товар создан');
    }
    setOpen(false);
  }

  function remove(id) {
    if (!confirm('Удалить товар?')) return;
    deleteProduct(id);
    toast.success('Удалено');
  }

  const catName = (id) => categories.find((c) => c.id === id)?.name ?? '—';
  const supplierName = (id) => suppliers.find((s) => s.id === id)?.name ?? '—';

  const scopedProducts = useMemo(() => {
    return products.filter((p) => {
      const byCat = bulkCategoryId === 'all' || p.categoryId === bulkCategoryId;
      const bySup = bulkSupplierId === 'all' || (p.supplierId || '') === bulkSupplierId;
      return byCat && bySup;
    });
  }, [products, bulkCategoryId, bulkSupplierId]);

  function applyBulkUpdate() {
    const priceRaw = bulkPriceValue.trim();
    const moqRaw = bulkMoqValue.trim();
    if (!priceRaw && !moqRaw) {
      toast.error('Укажите цену и/или MOQ для массового изменения');
      return;
    }

    const updates = [];
    for (const p of scopedProducts) {
      const patch = { id: p.id };
      if (priceRaw) {
        const v = Number(priceRaw);
        if (Number.isNaN(v) || v <= 0) {
          toast.error('Некорректное значение цены');
          return;
        }
        patch.priceUsd = bulkPriceMode === 'set' ? v : Number((p.priceUsd * v).toFixed(2));
      }
      if (moqRaw) {
        const v = Number(moqRaw);
        if (Number.isNaN(v) || v <= 0) {
          toast.error('Некорректное значение MOQ');
          return;
        }
        patch.moq = bulkMoqMode === 'set' ? Math.round(v) : Math.max(1, Math.round(p.moq * v));
      }
      updates.push(patch);
    }

    const changed = bulkUpdateProducts(updates, {
      source: 'bulk',
      note: `Фильтр: ${bulkCategoryId}/${bulkSupplierId}`,
    });
    toast.success(`Массово обновлено: ${changed} товаров`);
  }

  function exportCsv() {
    const rows = scopedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      categoryId: p.categoryId,
      categoryName: catName(p.categoryId),
      supplierId: p.supplierId || '',
      supplierName: supplierName(p.supplierId),
      priceUsd: p.priceUsd,
      moq: p.moq,
    }));
    const header = 'id,name,categoryId,categoryName,supplierId,supplierName,priceUsd,moq';
    const body = rows
      .map((r) =>
        [
          r.id,
          r.name,
          r.categoryId,
          r.categoryName,
          r.supplierId,
          r.supplierName,
          r.priceUsd,
          r.moq,
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const csv = `${header}\n${body}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-price-moq-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`CSV экспортирован (${rows.length} строк)`);
  }

  async function importCsv(file) {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) {
      toast.error('CSV пустой или без данных');
      return;
    }
    const header = lines[0].split(',').map((x) => x.trim().replace(/^"|"$/g, ''));
    const idIdx = header.indexOf('id');
    const priceIdx = header.indexOf('priceUsd');
    const moqIdx = header.indexOf('moq');
    if (idIdx < 0 || priceIdx < 0 || moqIdx < 0) {
      toast.error('Нужны колонки: id, priceUsd, moq');
      return;
    }
    const updates = [];
    for (let i = 1; i < lines.length; i += 1) {
      const cols = lines[i]
        .split(',')
        .map((x) => x.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
      const id = cols[idIdx];
      const priceUsd = Number(cols[priceIdx]);
      const moq = Number(cols[moqIdx]);
      if (!id || Number.isNaN(priceUsd) || Number.isNaN(moq) || priceUsd <= 0 || moq < 1) {
        continue;
      }
      updates.push({ id, priceUsd, moq: Math.round(moq) });
    }
    if (!updates.length) {
      toast.error('Не найдено валидных строк для обновления');
      return;
    }
    const changed = bulkUpdateProducts(updates, {
      source: 'csv_import',
      note: `Импорт: ${file.name}`,
    });
    toast.success(`CSV импортирован, обновлено ${changed} товаров`);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Товары</h1>
          <p className="text-sm text-zinc-400">CRUD, изображение — URL (mock загрузки)</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportCsv}>
            <Download className="mr-2 h-4 w-4" />
            Экспорт CSV
          </Button>
          <Button variant="secondary" onClick={() => csvInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Импорт CSV
          </Button>
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await importCsv(file);
              e.target.value = '';
            }}
          />
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-surface-800/50 p-4">
        <h2 className="text-sm font-semibold text-zinc-200">Массовое обновление цены и MOQ</h2>
        <div className="mt-3 grid gap-3 lg:grid-cols-6">
          <Select value={bulkCategoryId} onChange={(e) => setBulkCategoryId(e.target.value)}>
            <option value="all">Все категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select value={bulkSupplierId} onChange={(e) => setBulkSupplierId(e.target.value)}>
            <option value="all">Все поставщики</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Select value={bulkPriceMode} onChange={(e) => setBulkPriceMode(e.target.value)}>
            <option value="set">Цена: задать</option>
            <option value="factor">Цена: умножить</option>
          </Select>
          <Input
            placeholder={bulkPriceMode === 'set' ? 'Цена, USD' : 'Коэфф. цены (напр. 1.1)'}
            value={bulkPriceValue}
            onChange={(e) => setBulkPriceValue(e.target.value)}
          />
          <Select value={bulkMoqMode} onChange={(e) => setBulkMoqMode(e.target.value)}>
            <option value="set">MOQ: задать</option>
            <option value="factor">MOQ: умножить</option>
          </Select>
          <Input
            placeholder={bulkMoqMode === 'set' ? 'MOQ' : 'Коэфф. MOQ (напр. 0.8)'}
            value={bulkMoqValue}
            onChange={(e) => setBulkMoqValue(e.target.value)}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-zinc-500">В выборке: {scopedProducts.length} товаров</p>
          <Button onClick={applyBulkUpdate}>Применить массовое обновление</Button>
        </div>
      </div>

      <div className="mt-8">
        <DataTable
          columns={[
            {
              key: 'image',
              title: '',
              render: (row) => (
                <img
                  src={row.image}
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ),
            },
            { key: 'name', title: 'Название' },
            {
              key: 'categoryId',
              title: 'Категория',
              render: (row) => catName(row.categoryId),
            },
            {
              key: 'supplierId',
              title: 'Поставщик',
              render: (row) => supplierName(row.supplierId),
            },
            {
              key: 'priceUsd',
              title: 'Цена $',
              render: (row) => row.priceUsd.toFixed(2),
            },
            {
              key: 'moq',
              title: 'MOQ',
              render: (row) => row.moq,
            },
            {
              key: 'actions',
              title: '',
              render: (row) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-surface-700 hover:text-brand-400"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(row.id)}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-red-950/50 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
          rows={products}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-100">История изменений цены/MOQ</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Последние изменения из ручного редактирования, bulk-операций и CSV-импорта
        </p>
        <div className="mt-4">
          <DataTable
            columns={[
              { key: 'changedAt', title: 'Дата', render: (row) => new Date(row.changedAt).toLocaleString('ru-RU') },
              { key: 'productName', title: 'Товар' },
              {
                key: 'price',
                title: 'Цена',
                render: (row) => `${row.oldPriceUsd.toFixed(2)} -> ${row.newPriceUsd.toFixed(2)}`,
              },
              {
                key: 'moq',
                title: 'MOQ',
                render: (row) => `${row.oldMoq} -> ${row.newMoq}`,
              },
              { key: 'source', title: 'Источник' },
              { key: 'note', title: 'Комментарий', render: (row) => row.note || '—' },
            ]}
            rows={priceHistory.slice(0, 25)}
            emptyText="История пока пуста"
          />
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
            <motion.form
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={(ev) => ev.stopPropagation()}
              onSubmit={save}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-700 bg-surface-800 p-6"
            >
              <h2 className="text-lg font-semibold text-zinc-100">
                {editing ? 'Редактировать' : 'Новый товар'}
              </h2>
              <div className="mt-4 space-y-3">
                <Input
                  label="Название"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  error={errors.name}
                />
                <Textarea
                  label="Описание"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  error={errors.description}
                />
                <Select
                  label="Категория"
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, categoryId: e.target.value }))
                  }
                  error={errors.categoryId}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Поставщик"
                  value={form.supplierId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, supplierId: e.target.value }))
                  }
                >
                  <option value="">Не выбран</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Цена (USD)"
                  type="number"
                  step="0.01"
                  value={form.priceUsd}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, priceUsd: e.target.value }))
                  }
                  error={errors.priceUsd}
                />
                <Input
                  label="MOQ"
                  type="number"
                  min={1}
                  value={form.moq}
                  onChange={(e) => setForm((f) => ({ ...f, moq: e.target.value }))}
                  error={errors.moq}
                />
                <Input
                  label="URL изображения"
                  placeholder="https://…"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                />
              </div>
              <div className="mt-6 flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" className="flex-1">
                  Сохранить
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
