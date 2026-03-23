import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { useOperationsStore } from '../store/operationsStore';
import { useAuthStore } from '../store/authStore';
import { STATUS } from '../lib/constants';
import { formatDate } from '../lib/utils';
import { downloadCsv } from '../lib/csv';

const statusOptions = [
  { value: STATUS.NEW, label: 'Новая' },
  { value: STATUS.PROCESSING, label: 'В обработке' },
  { value: STATUS.SUPPLIER_FOUND, label: 'Найден поставщик' },
  { value: STATUS.PRODUCTION, label: 'Производство' },
  { value: STATUS.SHIPPED, label: 'Отправлено' },
  { value: STATUS.COMPLETED, label: 'Завершено' },
];

export function AdminOrders() {
  const orders = useOperationsStore((s) => s.orders);
  const payments = useOperationsStore((s) => s.payments);
  const quoteRequests = useOperationsStore((s) => s.quoteRequests);
  const updateOrder = useOperationsStore((s) => s.updateOrder);
  const addOrder = useOperationsStore((s) => s.addOrder);
  const users = useAuthStore((s) => s.users);

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [create, setCreate] = useState({
    userId: '',
    title: '',
    itemsSummary: '',
    relatedRequestId: '',
    status: STATUS.PROCESSING,
  });

  const userEmail = (id) => users.find((u) => u.id === id)?.email ?? id;

  function openCreate() {
    const clients = users.filter((u) => u.role === 'client');
    setCreate({
      userId: clients[0]?.id || '',
      title: '',
      itemsSummary: '',
      relatedRequestId: '',
      status: STATUS.PROCESSING,
    });
    setOpen(true);
  }

  function saveOrder() {
    if (!edit) return;
    updateOrder(edit.id, {
      status: edit.status,
      trackingNumber: edit.trackingNumber || null,
      managerNote: edit.managerNote || '',
    });
    toast.success('Заказ обновлён');
    setEdit(null);
  }

  function createOrder(e) {
    e.preventDefault();
    if (!create.userId || !create.title.trim()) {
      toast.error('Укажите клиента и название');
      return;
    }
    addOrder({
      userId: create.userId,
      title: create.title,
      itemsSummary: create.itemsSummary,
      relatedRequestId: create.relatedRequestId || null,
      status: create.status,
    });
    toast.success('Заказ создан');
    setOpen(false);
  }

  const clients = users.filter((u) => u.role === 'client');

  function exportCsvFile() {
    const headers = ['ID', 'Клиент', 'Название', 'Статус', 'Трек', 'Создан'];
    const dataRows = orders.map((o) => [
      o.id,
      userEmail(o.userId),
      (o.title || '').replace(/\r?\n/g, ' '),
      o.status,
      o.trackingNumber || '',
      formatDate(o.createdAt),
    ]);
    downloadCsv('chinavertex-zakazy.csv', headers, dataRows);
    toast.success('CSV скачан');
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Заказы</h1>
          <p className="text-sm text-zinc-400">
            Создание из заявки (связь по ID), статусы, трек-номер
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportCsvFile}>
            <Download className="mr-2 h-4 w-4" />
            Экспорт CSV
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Новый заказ
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <DataTable
          columns={[
            { key: 'title', title: 'Заказ' },
            {
              key: 'userId',
              title: 'Клиент',
              render: (row) => (
                <span className="text-xs">{userEmail(row.userId)}</span>
              ),
            },
            {
              key: 'status',
              title: 'Статус',
              render: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: 'trackingNumber',
              title: 'Трекинг',
              render: (row) => row.trackingNumber || '—',
            },
            {
              key: 'updatedAt',
              title: 'Обновлён',
              render: (row) => formatDate(row.updatedAt),
            },
            {
              key: 'actions',
              title: '',
              render: (row) => (
                <Button size="sm" variant="secondary" onClick={() => setEdit({ ...row })}>
                  Изменить
                </Button>
              ),
            },
          ]}
          rows={orders}
        />
      </div>

      <AnimatePresence>
        {edit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
            onClick={() => setEdit(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-zinc-700 bg-surface-800 p-6"
            >
              <h2 className="text-lg font-semibold text-zinc-100">{edit.title}</h2>
              {(edit.paymentMethod === 'crypto_usdt_trc20' || edit.paymentScreenshot) && (
                <div className="mt-4 rounded-xl border border-zinc-700 bg-zinc-900/50 p-3">
                  <p className="mb-2 text-sm font-medium text-zinc-300">Оплата USDT (TRC20)</p>
                  {(edit.paymentScreenshot ||
                    payments.find((p) => p.orderId === edit.id)?.receiptDataUrl) && (
                    <div>
                      <p className="mb-2 text-xs text-zinc-500">Скриншот об оплате:</p>
                      <img
                        src={
                          edit.paymentScreenshot ||
                          payments.find((p) => p.orderId === edit.id)?.receiptDataUrl
                        }
                        alt="Скриншот оплаты"
                        className="max-h-48 w-full rounded-lg border border-zinc-700 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="mt-4 space-y-4">
                <Select
                  label="Статус"
                  value={edit.status}
                  onChange={(e) =>
                    setEdit((o) => ({ ...o, status: e.target.value }))
                  }
                >
                  {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Трек-номер"
                  value={edit.trackingNumber || ''}
                  onChange={(e) =>
                    setEdit((o) => ({ ...o, trackingNumber: e.target.value }))
                  }
                  placeholder="CP123456789RU"
                />
                <Textarea
                  label="Комментарий"
                  value={edit.managerNote || ''}
                  onChange={(e) =>
                    setEdit((o) => ({ ...o, managerNote: e.target.value }))
                  }
                />
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setEdit(null)}>
                  Закрыть
                </Button>
                <Button className="flex-1" onClick={saveOrder}>
                  Сохранить
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={createOrder}
              className="w-full max-w-md rounded-2xl border border-zinc-700 bg-surface-800 p-6"
            >
              <h2 className="text-lg font-semibold text-zinc-100">Новый заказ</h2>
              <div className="mt-4 space-y-4">
                <Select
                  label="Клиент"
                  value={create.userId}
                  onChange={(e) =>
                    setCreate((c) => ({ ...c, userId: e.target.value }))
                  }
                >
                  {clients.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.email}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Название заказа"
                  value={create.title}
                  onChange={(e) =>
                    setCreate((c) => ({ ...c, title: e.target.value }))
                  }
                />
                <Textarea
                  label="Состав / примечание"
                  value={create.itemsSummary}
                  onChange={(e) =>
                    setCreate((c) => ({ ...c, itemsSummary: e.target.value }))
                  }
                />
                <Select
                  label="Связанная заявка (ID, опционально)"
                  value={create.relatedRequestId}
                  onChange={(e) =>
                    setCreate((c) => ({ ...c, relatedRequestId: e.target.value }))
                  }
                >
                  <option value="">— нет —</option>
                  {quoteRequests.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id} — {r.productName?.slice(0, 40)}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Статус"
                  value={create.status}
                  onChange={(e) =>
                    setCreate((c) => ({ ...c, status: e.target.value }))
                  }
                >
                  {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mt-6 flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" className="flex-1">
                  Создать
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
