import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_FAVORITES,
} from '../data/seed';
import { uid } from '../lib/utils';

export const useCatalogStore = create(
  persist(
    (set, get) => ({
      categories: SEED_CATEGORIES.map((c) => ({ ...c })),
      products: SEED_PRODUCTS.map((p) => ({ ...p, supplierId: p.supplierId || '' })),
      favorites: { ...SEED_FAVORITES },
      priceHistory: [],

      addCategory: (data) => {
        const id = uid('cat');
        set((s) => ({
          categories: [
            ...s.categories,
            {
              id,
              name: data.name.trim(),
              slug: data.slug?.trim() || data.name.trim().toLowerCase().replace(/\s+/g, '-'),
            },
          ],
        }));
        return id;
      },

      updateCategory: (id, patch) => {
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, ...patch, name: patch.name?.trim() ?? c.name } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
          products: s.products.filter((p) => p.categoryId !== id),
        }));
      },

      addProduct: (data) => {
        const id = uid('prod');
        set((s) => ({
          products: [
            ...s.products,
            {
              id,
              name: data.name.trim(),
              description: data.description.trim(),
              priceUsd: Number(data.priceUsd),
              moq: Number(data.moq),
              categoryId: data.categoryId,
              supplierId: data.supplierId || '',
              image: data.image?.trim() || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
            },
          ],
        }));
        return id;
      },

      updateProduct: (id, patch, meta = {}) => {
        set((s) => {
          let historyEntry = null;
          const products = s.products.map((p) => {
            if (p.id !== id) return p;
            const nextPrice = patch.priceUsd != null ? Number(patch.priceUsd) : p.priceUsd;
            const nextMoq = patch.moq != null ? Number(patch.moq) : p.moq;
            const next = {
              ...p,
              ...patch,
              priceUsd: nextPrice,
              moq: nextMoq,
              supplierId: patch.supplierId ?? p.supplierId ?? '',
            };
            if (nextPrice !== p.priceUsd || nextMoq !== p.moq) {
              historyEntry = {
                id: uid('ph'),
                productId: p.id,
                productName: p.name,
                oldPriceUsd: p.priceUsd,
                newPriceUsd: nextPrice,
                oldMoq: p.moq,
                newMoq: nextMoq,
                source: meta.source || 'manual',
                note: meta.note || '',
                changedAt: new Date().toISOString(),
              };
            }
            return next;
          });
          return {
            products,
            priceHistory: historyEntry ? [historyEntry, ...s.priceHistory] : s.priceHistory,
          };
        });
      },

      bulkUpdateProducts: (updates, meta = {}) => {
        if (!Array.isArray(updates) || updates.length === 0) return 0;
        let affected = 0;
        set((s) => {
          const updatesMap = new Map(updates.map((u) => [u.id, u]));
          const historyEntries = [];
          const products = s.products.map((p) => {
            const patch = updatesMap.get(p.id);
            if (!patch) return p;
            const nextPrice = patch.priceUsd != null ? Number(patch.priceUsd) : p.priceUsd;
            const nextMoq = patch.moq != null ? Number(patch.moq) : p.moq;
            const next = {
              ...p,
              ...patch,
              priceUsd: nextPrice,
              moq: nextMoq,
              supplierId: patch.supplierId ?? p.supplierId ?? '',
            };
            if (nextPrice !== p.priceUsd || nextMoq !== p.moq) {
              affected += 1;
              historyEntries.push({
                id: uid('ph'),
                productId: p.id,
                productName: p.name,
                oldPriceUsd: p.priceUsd,
                newPriceUsd: nextPrice,
                oldMoq: p.moq,
                newMoq: nextMoq,
                source: meta.source || 'bulk',
                note: meta.note || '',
                changedAt: new Date().toISOString(),
              });
            }
            return next;
          });
          return {
            products,
            priceHistory: historyEntries.length
              ? [...historyEntries.reverse(), ...s.priceHistory]
              : s.priceHistory,
          };
        });
        return affected;
      },

      deleteProduct: (id) => {
        set((s) => ({
          products: s.products.filter((p) => p.id !== id),
          favorites: Object.fromEntries(
            Object.entries(s.favorites).map(([uidKey, ids]) => [
              uidKey,
              ids.filter((x) => x !== id),
            ])
          ),
        }));
      },

      toggleFavorite: (userId, productId) => {
        if (!userId) return;
        set((s) => {
          const list = s.favorites[userId] || [];
          const has = list.includes(productId);
          return {
            favorites: {
              ...s.favorites,
              [userId]: has ? list.filter((x) => x !== productId) : [...list, productId],
            },
          };
        });
      },

      isFavorite: (userId, productId) => {
        if (!userId) return false;
        return (get().favorites[userId] || []).includes(productId);
      },
    }),
    {
      name: 'cv-catalog',
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        products: Array.isArray(persisted?.products)
          ? persisted.products.map((p) => ({ ...p, supplierId: p.supplierId || '' }))
          : current.products,
        categories: Array.isArray(persisted?.categories) ? persisted.categories : current.categories,
        favorites: persisted?.favorites || current.favorites,
        priceHistory: Array.isArray(persisted?.priceHistory) ? persisted.priceHistory : current.priceHistory,
      }),
    }
  )
);
