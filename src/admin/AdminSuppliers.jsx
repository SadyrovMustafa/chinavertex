import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { DataTable } from '../components/ui/DataTable';
import { useAdminDataStore } from '../store/adminDataStore';

export function AdminSuppliers() {
  const suppliers = useAdminDataStore((s) => s.suppliers);
  const addSupplier = useAdminDataStore((s) => s.addSupplier);
  const updateSupplier = useAdminDataStore((s) => s.updateSupplier);
  const deleteSupplier = useAdminDataStore((s) => s.deleteSupplier);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    city: '',
    contactPerson: '',
    phone: '',
    wechat: '',
    email: '',
    notes: '',
    tags: '',
  });

  function openCreate() {
    setEditing(null);
    setForm({
      name: '',
      city: '',
      contactPerson: '',
      phone: '',
      wechat: '',
      email: '',
      notes: '',
      tags: '',
    });
    setOpen(true);
  }

  function openEdit(s) {
    setEditing(s);
    setForm({
      name: s.name,
      city: s.city || '',
      contactPerson: s.contactPerson || '',
      phone: s.phone || '',
      wechat: s.wechat || '',
      email: s.email || '',
      notes: s.notes || '',
      tags: s.tags || '',
    });
    setOpen(true);
  }

  function save(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Укажите название фабрики');
      return;
    }
    if (editing) {
      updateSupplier(editing.id, { ...form });
      toast.success('Сохранено');
    } else {
      addSupplier(form);
      toast.success('Добавлено');
    }
    setOpen(false);
  }

  function remove(id) {
    if (!confirm('Удалить запись?')) return;
    deleteSupplier(id);
    toast.success('Удалено');
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Справочник поставщиков</h1>
          <p className="text-sm text-zinc-400">
            Внутренняя база фабрик и контактов (не показывается клиентам)
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить
        </Button>
      </div>

      <div className="mt-8">
        <DataTable
          columns={[
            { key: 'name', title: 'Название' },
            { key: 'city', title: 'Город' },
            { key: 'contactPerson', title: 'Контакт' },
            { key: 'phone', title: 'Телефон' },
            {
              key: 'tags',
              title: 'Теги',
              render: (row) => (
                <span className="text-xs text-zinc-500">{row.tags || '—'}</span>
              ),
            },
            {
              key: 'actions',
              title: '',
              render: (row) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-surface-700"
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
          rows={suppliers}
        />
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
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={(ev) => ev.stopPropagation()}
              onSubmit={save}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-700 bg-surface-800 p-6"
            >
              <h2 className="text-lg font-semibold text-zinc-100">
                {editing ? 'Редактировать' : 'Новый поставщик'}
              </h2>
              <div className="mt-4 space-y-3">
                <Input
                  label="Название"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <Input
                  label="Город"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
                <Input
                  label="Контактное лицо"
                  value={form.contactPerson}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contactPerson: e.target.value }))
                  }
                />
                <Input
                  label="Телефон"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
                <Input
                  label="WeChat"
                  value={form.wechat}
                  onChange={(e) => setForm((f) => ({ ...f, wechat: e.target.value }))}
                />
                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                <Input
                  label="Теги"
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                />
                <Textarea
                  label="Заметки"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
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
