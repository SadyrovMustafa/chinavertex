import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../lib/utils';
import { ROLES } from '../lib/constants';

const roleLabel = {
  [ROLES.CLIENT]: 'Клиент',
  [ROLES.ADMIN]: 'Админ',
  [ROLES.MANAGER]: 'Менеджер',
};

const roleClass = {
  [ROLES.CLIENT]: 'border-zinc-600 bg-zinc-700/40 text-zinc-300',
  [ROLES.ADMIN]: 'border-brand-500/40 bg-brand-600/20 text-brand-300',
  [ROLES.MANAGER]: 'border-violet-500/40 bg-violet-600/20 text-violet-300',
};

export function AdminUsers() {
  const usersRaw = useAuthStore((s) => s.users);
  const users = useMemo(
    () =>
      (usersRaw ?? []).map(({ password: _p, ...rest }) => rest),
    [usersRaw]
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-zinc-50">Пользователи</h1>
        <p className="text-sm text-zinc-400">
          Список из mock-хранилища. Пароли не отображаются.
        </p>
      </motion.div>

      <div className="mt-8">
        <DataTable
          columns={[
            { key: 'name', title: 'Имя' },
            { key: 'email', title: 'Email' },
            {
              key: 'company',
              title: 'Компания',
              render: (row) => row.company || '—',
            },
            {
              key: 'role',
              title: 'Роль',
              render: (row) => (
                <Badge className={roleClass[row.role] || ''}>
                  {roleLabel[row.role] || row.role}
                </Badge>
              ),
            },
            {
              key: 'createdAt',
              title: 'Регистрация',
              render: (row) => formatDate(row.createdAt),
            },
          ]}
          rows={users}
        />
      </div>

      <Card className="mt-8 p-6">
        <h2 className="font-semibold text-zinc-200">Просмотр профиля</h2>
        <p className="mt-2 text-sm text-zinc-500">
          В демо достаточно таблицы. При подключении API здесь будет карточка
          пользователя с историей заявок и заказов.
        </p>
      </Card>
    </div>
  );
}
