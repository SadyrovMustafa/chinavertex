import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { DataTable } from '../components/ui/DataTable';
import { useAdminDataStore } from '../store/adminDataStore';

const contexts = [
  { value: 'any', label: 'Универсальный' },
  { value: 'quote', label: 'Заявка цены' },
  { value: 'sourcing', label: 'Sourcing' },
  { value: 'order', label: 'Заказ' },
];

export function AdminTemplates() {
  const templates = useAdminDataStore((s) => s.responseTemplates);
  const addTemplate = useAdminDataStore((s) => s.addTemplate);
  const updateTemplate = useAdminDataStore((s) => s.updateTemplate);
  const deleteTemplate = useAdminDataStore((s) => s.deleteTemplate);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    body: '',
    context: 'any',
    suggestedStatus: '',
  });

  function openCreate() {
    setEditing(null);
    setForm({ title: '', body: '', context: 'any', suggestedStatus: '' });
    setOpen(true);
  }

  function openEdit(t) {
    setEditing(t);
    setForm({
      title: t.title,
      body: t.body,
      context: t.context || 'any',
      suggestedStatus: t.suggestedStatus || '',
    });
    setOpen(true);
  }

  function save(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Заполните название и текст');
      return;
    }
    if (editing) {
      updateTemplate(editing.id, {
        title: form.title,
        body: form.body,
        context: form.context,
        suggestedStatus: form.suggestedStatus || undefined,
      });
      toast.success('Шаблон обновлён');
    } else {
      addTemplate({
        title: form.title,
        body: form.body,
        context: form.context,
        suggestedStatus: form.suggestedStatus || undefined,
      });
      toast.success('Шаблон создан');
    }
    setOpen(false);
  }

  function remove(id) {
    if (!confirm('Удалить шаблон?')) return;
    deleteTemplate(id);
    toast.success('Удалено');
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Шаблоны ответов</h1>
          <p className="text-sm text-zinc-400">
            Быстрый текст и опционально статус для клиента в заявках
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
            { key: 'title', title: 'Название' },
            {
              key: 'context',
              title: 'Контекст',
              render: (row) =>
                contexts.find((c) => c.value === (row.context || 'any'))?.label ??
                row.context,
            },
            {
              key: 'body',
              title: 'Текст',
              render: (row) => (
                <span className="line-clamp-2 text-zinc-400">{row.body}</span>
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
          rows={templates}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
            onClick={() => setOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(ev) => ev.stopPropagation()}
              onSubmit={save}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-700 bg-surface-800 p-6"
            >
              <h2 className="text-lg font-semibold text-zinc-100">
                {editing ? 'Редактировать' : 'Новый шаблон'}
              </h2>
              <div className="mt-4 space-y-4">
                <Input
                  label="Название"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
                <Select
                  label="Контекст"
                  value={form.context}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, context: e.target.value }))
                  }
                >
                  {contexts.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Подставить статус (опционально, ключ)"
                  placeholder="processing"
                  value={form.suggestedStatus}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, suggestedStatus: e.target.value }))
                  }
                />
                <Textarea
                  label="Текст для клиента"
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
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
