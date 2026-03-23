import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SEED_USERS } from '../data/seed';
import { ROLES } from '../lib/constants';
import { uid } from '../lib/utils';

function stripPassword(user) {
  if (!user) return null;
  const { password: _p, ...rest } = user;
  return rest;
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      users: SEED_USERS.map((u) => ({ ...u })),
      user: null,

      login: (email, password) => {
        const normalized = email.trim().toLowerCase();
        const found = get().users.find(
          (u) => u.email.toLowerCase() === normalized && u.password === password
        );
        if (!found) return { ok: false, error: 'Неверный email или пароль.' };
        set({ user: stripPassword(found) });
        return { ok: true };
      },

      register: ({ email, password, name, company }) => {
        const normalized = email.trim().toLowerCase();
        if (get().users.some((u) => u.email.toLowerCase() === normalized)) {
          return { ok: false, error: 'Пользователь с таким email уже есть.' };
        }
        if (password.length < 6) {
          return { ok: false, error: 'Пароль не короче 6 символов.' };
        }
        const newUser = {
          id: uid('user'),
          email: normalized,
          password,
          name: name.trim(),
          company: (company || '').trim(),
          role: ROLES.CLIENT,
          phone: '',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          users: [...s.users, newUser],
          user: stripPassword(newUser),
        }));
        return { ok: true };
      },

      logout: () => set({ user: null }),

      updateProfile: (patch) => {
        const u = get().user;
        if (!u) return;
        set((s) => {
          const users = s.users.map((x) =>
            x.id === u.id ? { ...x, ...patch } : x
          );
          const updated = users.find((x) => x.id === u.id);
          return {
            users,
            user: stripPassword(updated),
          };
        });
      },

      /** Для админки: список без паролей */
      getUsersSafe: () => get().users.map(stripPassword),

      /** Внутренний доступ к паролю только для «смены» в mock */
      resetPasswordMock: (email) => {
        const normalized = email.trim().toLowerCase();
        const exists = get().users.some((u) => u.email.toLowerCase() === normalized);
        return exists;
      },
    }),
    {
      name: 'cv-auth',
      partialize: (s) => ({ user: s.user, users: s.users }),
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        users: persisted?.users?.length ? persisted.users : current.users,
      }),
    }
  )
);
