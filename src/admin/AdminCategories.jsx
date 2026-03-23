import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DataTable } from '../components/ui/DataTable';
import { useCatalogStore } from '../store/catalogStore';

export function AdminCategories() {
  const categories = useCatalogStore((s) => s.categories);
  const addCategory = useCatalogStore((s) => s.addCategory);
  const updateCategory = useCatalogStore((s) => s.updateCategory);
  const deleteCategory = useCatalogStore((s) => s.deleteCategory);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');

  function openCreate() {
    setEditing(null);
    setName('');
    setSlug('');
    setError('');
    setOpen(true);
  }

  function openEdit(c) {
    setEditing(c);
    setName(c.name);
    setSlug(c.slug);
    setError('');
    setOpen(true);
  }

  function save(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Введите название');
      return;
    }
    if (editing) {
      updateCategory(editing.id, { name, slug: slug.trim() || undefined });
      toast.success('Категория обновлена');
    } else {
      addCategory({ name, slug });
      toast.success('Категория создана');
    }
    setOpen(false);
  }

  function remove(id) {
    if (!confirm('Удалить категорию? Товары этой категории будут скрыты из фильтра.')) return;
    deleteCategory(id);
    toast.success('Удалено');
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Категории</h1>
          <p className="text-sm text-zinc-400">Создание, slug для URL, удаление</p>
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
            { key: 'slug', title: 'Slug' },
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
          rows={categories}
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(ev) => ev.stopPropagation()}
              onSubmit={save}
              className="w-full max-w-md rounded-2xl border border-zinc-700 bg-surface-800 p-6"
            >
              <h2 className="text-lg font-semibold text-zinc-100">
                {editing ? 'Редактировать' : 'Новая категория'}
              </h2>
              <div className="mt-4 space-y-4">
                <Input
                  label="Название"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={error}
                />
                <Input
                  label="Slug (необязательно)"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="electronics"
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
