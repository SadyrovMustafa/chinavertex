import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Package } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuthStore } from '../store/authStore';
import { useCatalogStore } from '../store/catalogStore';
import { ROLES } from '../lib/constants';

export function ProductCard({ product, categoryName, index = 0 }) {
  const user = useAuthStore((s) => s.user);
  const toggleFavorite = useCatalogStore((s) => s.toggleFavorite);
  const isFavorite = useCatalogStore((s) => s.isFavorite(user?.id, product.id));

  const fav =
    user && user.role === ROLES.CLIENT ? (
      <button
        type="button"
        onClick={() => toggleFavorite(user.id, product.id)}
        className="absolute right-3 top-3 rounded-full bg-surface-900/70 p-2 text-zinc-300 transition hover:text-red-400"
        aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
      >
        <Heart
          className="h-5 w-5"
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </button>
    ) : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-surface-800/70 shadow-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-700">
        <img
          src={product.image}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {fav}
        {categoryName && (
          <span className="absolute left-3 top-3 rounded-full bg-surface-900/75 px-2.5 py-1 text-xs text-zinc-200">
            {categoryName}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-zinc-100 line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-zinc-400">
          {product.description}
        </p>
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              от
            </p>
            <p className="text-lg font-semibold text-brand-400">
              ${product.priceUsd.toFixed(2)}
            </p>
            <p className="text-xs text-zinc-500">MOQ {product.moq} шт.</p>
          </div>
          <Link to={`/product/${product.id}`}>
            <Button size="sm" variant="secondary">
              <Package className="mr-1.5 h-4 w-4" />
              Подробнее
            </Button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
