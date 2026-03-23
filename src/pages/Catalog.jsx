import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ProductCard } from '../components/ProductCard';
import { useCatalogStore } from '../store/catalogStore';

const PAGE_SIZE = 9;

export function Catalog() {
  const categories = useCatalogStore((s) => s.categories);
  const products = useCatalogStore((s) => s.products);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [sortBy, setSortBy] = useState('relevant');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const base = products.filter((p) => {
      const matchCat = cat === 'all' || p.categoryId === cat;
      const s = q.trim().toLowerCase();
      const matchQ =
        !s ||
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s);
      return matchCat && matchQ;
    });

    if (sortBy === 'price-asc') {
      return [...base].sort((a, b) => a.priceUsd - b.priceUsd);
    }
    if (sortBy === 'price-desc') {
      return [...base].sort((a, b) => b.priceUsd - a.priceUsd);
    }
    if (sortBy === 'name-asc') {
      return [...base].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    }
    return base;
  }, [products, q, cat, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paged = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page, totalPages]);

  const catName = (id) => categories.find((c) => c.id === id)?.name;
  const hasResults = filtered.length > 0;

  const onChangeSearch = (value) => {
    setQ(value);
    setPage(1);
  };

  const onChangeCategory = (value) => {
    setCat(value);
    setPage(1);
  };

  const onChangeSort = (value) => {
    setSortBy(value);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <h1 className="text-3xl font-bold text-zinc-50">Каталог</h1>
        <p className="mt-2 text-zinc-400">
          Актуальные позиции с ориентировочной ценой и MOQ. Точные условия — после
          заявки и согласования с фабрикой.
        </p>
      </motion.div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Поиск по названию или описанию"
            value={q}
            onChange={(e) => onChangeSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full lg:w-60">
          <Select
            value={sortBy}
            onChange={(e) => onChangeSort(e.target.value)}
            aria-label="Сортировка каталога"
          >
            <option value="relevant">По релевантности</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
            <option value="name-asc">Название: А-Я</option>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChangeCategory('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              cat === 'all'
                ? 'bg-brand-600 text-white'
                : 'bg-surface-800 text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Все
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onChangeCategory(c.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                cat === c.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-800 text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {hasResults && (
        <p className="mt-6 text-sm text-zinc-400">
          Найдено: {filtered.length}
        </p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            categoryName={catName(p.categoryId)}
            index={i}
          />
        ))}
      </div>

      {hasResults && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Назад
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`rounded-lg px-3 py-2 text-sm ${
                p === page
                  ? 'bg-brand-600 text-white'
                  : 'border border-zinc-700 text-zinc-200'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Вперёд
          </button>
        </div>
      )}

      {!hasResults && (
        <p className="py-16 text-center text-zinc-500">
          Ничего не найдено. Измените запрос или категорию.
        </p>
      )}
    </div>
  );
}
