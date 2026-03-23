import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SEED_RESPONSE_TEMPLATES, SEED_SUPPLIERS } from '../data/seed';
import { uid } from '../lib/utils';

const DEFAULT_CRYPTO_SETTINGS = {
  usdtTrc20Wallet: 'TYourWalletAddressUSDTTRC20Here',
};

export const useAdminDataStore = create(
  persist(
    (set) => ({
      responseTemplates: SEED_RESPONSE_TEMPLATES.map((t) => ({ ...t })),
      suppliers: SEED_SUPPLIERS.map((s) => ({ ...s })),
      cryptoSettings: DEFAULT_CRYPTO_SETTINGS,

      updateCryptoSettings: (patch) => {
        set((s) => ({
          cryptoSettings: { ...s.cryptoSettings, ...patch },
        }));
      },

      addTemplate: (data) => {
        const id = uid('tpl');
        set((s) => ({
          responseTemplates: [
            ...s.responseTemplates,
            {
              id,
              title: data.title.trim(),
              body: data.body.trim(),
              context: data.context || 'any',
              suggestedStatus: data.suggestedStatus || '',
            },
          ],
        }));
        return id;
      },

      updateTemplate: (id, patch) => {
        set((s) => ({
          responseTemplates: s.responseTemplates.map((t) =>
            t.id === id ? { ...t, ...patch } : t
          ),
        }));
      },

      deleteTemplate: (id) => {
        set((s) => ({
          responseTemplates: s.responseTemplates.filter((t) => t.id !== id),
        }));
      },

      addSupplier: (data) => {
        const id = uid('sup');
        set((s) => ({
          suppliers: [
            ...s.suppliers,
            {
              id,
              name: data.name.trim(),
              city: (data.city || '').trim(),
              contactPerson: (data.contactPerson || '').trim(),
              phone: (data.phone || '').trim(),
              wechat: (data.wechat || '').trim(),
              email: (data.email || '').trim(),
              notes: (data.notes || '').trim(),
              tags: (data.tags || '').trim(),
            },
          ],
        }));
        return id;
      },

      updateSupplier: (id, patch) => {
        set((s) => ({
          suppliers: s.suppliers.map((x) =>
            x.id === id ? { ...x, ...patch } : x
          ),
        }));
      },

      deleteSupplier: (id) => {
        set((s) => ({
          suppliers: s.suppliers.filter((x) => x.id !== id),
        }));
      },
    }),
    {
      name: 'cv-admin-data',
      merge: (p, c) => ({
        ...c,
        ...p,
        responseTemplates: Array.isArray(p?.responseTemplates)
          ? p.responseTemplates
          : c.responseTemplates,
        suppliers: Array.isArray(p?.suppliers) ? p.suppliers : c.suppliers,
        cryptoSettings: p?.cryptoSettings || c.cryptoSettings,
      }),
    }
  )
);
