import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useAuthStore } from '../store/authStore';
import { useCatalogStore } from '../store/catalogStore';

export function Favorites() {
  const user = useAuthStore((s) => s.user);
  const products = useCatalogStore((s) => s.products);
  const favorites = useCatalogStore((s) =>
    user ? s.favorites[user.id] || [] : []
  );
  const categories = useCatalogStore((s) => s.categories);
  const catName = (id) => categories.find((c) => c.id === id)?.name;

  const list = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Heart className="h-8 w-8 text-red-400" fill="currentColor" />
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">Избранное</h1>
          <p className="mt-1 text-zinc-400">
            Сохранённые позиции каталога. Нажмите на сердечко на карточке, чтобы
            убрать товар.
          </p>
        </div>
      </motion.div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            categoryName={catName(p.categoryId)}
            index={i}
          />
        ))}
      </div>

      {!list.length && (
        <div className="py-20 text-center">
          <p className="text-zinc-500">В избранном пусто.</p>
          <Link
            to="/catalog"
            className="mt-4 inline-block text-brand-400 hover:underline"
          >
            Перейти в каталог
          </Link>
        </div>
      )}
    </div>
  );
}
