import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { useOperationsStore } from '../store/operationsStore';
import { useAuthStore } from '../store/authStore';
import { useAdminDataStore } from '../store/adminDataStore';
import { STATUS, ROLES } from '../lib/constants';
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

const STATUS_VALUES = new Set(Object.values(STATUS));

export function AdminRequests() {
  const quoteRequests = useOperationsStore((s) => s.quoteRequests);
  const sourcingRequests = useOperationsStore((s) => s.sourcingRequests);
  const threadMessages = useOperationsStore((s) => s.threadMessages);
  const updateQuoteRequest = useOperationsStore((s) => s.updateQuoteRequest);
  const updateSourcingRequest = useOperationsStore((s) => s.updateSourcingRequest);
  const addThreadMessage = useOperationsStore((s) => s.addThreadMessage);
  const users = useAuthStore((s) => s.users);
  const templates = useAdminDataStore((s) => s.responseTemplates);

  const managers = users.filter(
    (u) => u.role === ROLES.MANAGER || u.role === ROLES.ADMIN
  );

  const [detail, setDetail] = useState(null);
  const [chatReply, setChatReply] = useState('');

  const rows = useMemo(() => {
    const q = quoteRequests.map((r) => ({
      ...r,
      _type: 'quote',
      _title: r.productName,
    }));
    const s = sourcingRequests.map((r) => ({
      ...r,
      _type: 'sourcing',
      _title: r.description?.slice(0, 60) || r.productUrl || 'Sourcing',
    }));
    return [...q, ...s].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [quoteRequests, sourcingRequests]);

  const userEmail = (id) => users.find((u) => u.id === id)?.email ?? id;

  const threadForDetail = useMemo(() => {
    if (!detail) return [];
    const ct = detail._type === 'quote' ? 'quote' : 'sourcing';
    return threadMessages
      .filter((m) => m.contextType === ct && m.contextId === detail.id)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [detail, threadMessages]);

  const filteredTemplates = useMemo(() => {
    if (!detail) return [];
    return templates.filter(
      (t) =>
        t.context === 'any' ||
        (detail._type === 'quote' && t.context === 'quote') ||
        (detail._type === 'sourcing' && t.context === 'sourcing')
    );
  }, [detail, templates]);

  function exportCsvFile() {
    const headers = ['Тип', 'ID', 'Клиент', 'Тема', 'Статус', 'Создана'];
    const dataRows = rows.map((r) => [
      r._type === 'quote' ? 'Цена' : 'Sourcing',
      r.id,
      userEmail(r.userId),
      (r._title || '').replace(/\r?\n/g, ' '),
      r.status,
      formatDate(r.createdAt),
    ]);
    downloadCsv('chinavertex-zayavki.csv', headers, dataRows);
    toast.success('CSV скачан');
  }

  function saveDetail() {
    if (!detail) return;
    if (detail._type === 'quote') {
      updateQuoteRequest(detail.id, {
        status: detail.status,
        managerNote: detail.managerNote,
        assignedManagerId: detail.assignedManagerId || null,
      });
    } else if (detail._type === 'sourcing') {
      updateSourcingRequest(detail.id, {
        status: detail.status,
        managerNote: detail.managerNote,
        assignedManagerId: detail.assignedManagerId || null,
      });
    }
    toast.success('Сохранено');
    setDetail(null);
    setChatReply('');
  }

  function applyTemplate(tplId) {
    if (!detail || !tplId) return;
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;
    setDetail((d) => {
      const next = {
        ...d,
        managerNote: [d.managerNote, tpl.body].filter(Boolean).join('\n\n'),
      };
      if (tpl.suggestedStatus && STATUS_VALUES.has(tpl.suggestedStatus)) {
        next.status = tpl.suggestedStatus;
      }
      return next;
    });
    toast.success('Шаблон подставлен');
  }

  function sendChat() {
    if (!detail || !chatReply.trim()) return;
    const ct = detail._type === 'quote' ? 'quote' : 'sourcing';
    addThreadMessage({
      userId: detail.userId,
      contextType: ct,
      contextId: detail.id,
      from: 'manager',
      body: chatReply,
    });
    setChatReply('');
    toast.success('Сообщение в чате');
  }

  function openDetail(row) {
    setDetail({ ...row });
    setChatReply('');
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold text-zinc-50">Заявки</h1>
          <p className="text-sm text-zinc-400">Цены по каталогу и sourcing-запросы</p>
        </motion.div>
        <Button variant="outline" onClick={exportCsvFile}>
          <Download className="mr-2 h-4 w-4" />
          Экспорт CSV
        </Button>
      </div>

      <div className="mt-8">
        <DataTable
          columns={[
            {
              key: 'type',
              title: 'Тип',
              render: (row) =>
                row._type === 'quote' ? (
                  <span className="text-sky-400">Цена</span>
                ) : (
                  <span className="text-violet-400">Sourcing</span>
                ),
            },
            {
              key: '_title',
              title: 'Суть',
              render: (row) => (
                <span className="line-clamp-2">{row._title}</span>
              ),
            },
            {
              key: 'userId',
              title: 'Клиент',
              render: (row) => (
                <span className="text-xs text-zinc-400">{userEmail(row.userId)}</span>
              ),
            },
            {
              key: 'status',
              title: 'Статус',
              render: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: 'createdAt',
              title: 'Дата',
              render: (row) => formatDate(row.createdAt),
            },
            {
              key: 'actions',
              title: '',
              render: (row) => (
                <Button size="sm" variant="secondary" onClick={() => openDetail(row)}>
                  Открыть
                </Button>
              ),
            },
          ]}
          rows={rows}
        />
      </div>

      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 sm:items-center"
            onClick={() => {
              setDetail(null);
              setChatReply('');
            }}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-700 bg-surface-800 p-6"
            >
              <h2 className="text-lg font-semibold text-zinc-100">Заявка</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="text-zinc-500">Клиент</dt>
                  <dd>{userEmail(detail.userId)}</dd>
                </div>
                {detail._type === 'quote' && (
                  <>
                    <div>
                      <dt className="text-zinc-500">Товар</dt>
                      <dd>{detail.productName}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Количество</dt>
                      <dd>{detail.quantity}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Комментарий</dt>
                      <dd className="text-zinc-400">{detail.comment || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Ссылка / файл</dt>
                      <dd className="break-all text-zinc-400">
                        {detail.attachmentNote || '—'}
                      </dd>
                    </div>
                  </>
                )}
                {detail._type === 'sourcing' && (
                  <>
                    <div>
                      <dt className="text-zinc-500">Ссылка</dt>
                      <dd className="break-all">{detail.productUrl || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Описание</dt>
                      <dd className="text-zinc-400">{detail.description || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Количество</dt>
                      <dd>{detail.quantity}</dd>
                    </div>
                  </>
                )}
              </dl>

              <div className="mt-6 space-y-4">
                <Select
                  label="Статус"
                  value={detail.status}
                  onChange={(e) =>
                    setDetail((d) => ({ ...d, status: e.target.value }))
                  }
                >
                  {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Менеджер (mock)"
                  value={detail.assignedManagerId || ''}
                  onChange={(e) =>
                    setDetail((d) => ({
                      ...d,
                      assignedManagerId: e.target.value || null,
                    }))
                  }
                >
                  <option value="">— не назначен —</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </Select>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                    Шаблон ответа
                  </label>
                  <select
                    className="w-full rounded-xl border border-zinc-700 bg-surface-800 px-4 py-2.5 text-sm text-zinc-100"
                    defaultValue=""
                    onChange={(e) => {
                      applyTemplate(e.target.value);
                      e.target.value = '';
                    }}
                  >
                    <option value="">— подставить текст —</option>
                    {filteredTemplates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <Textarea
                  label="Комментарий менеджера (внутренний / для клиента)"
                  value={detail.managerNote || ''}
                  onChange={(e) =>
                    setDetail((d) => ({ ...d, managerNote: e.target.value }))
                  }
                />
              </div>

              <div className="mt-6 rounded-xl border border-zinc-700/80 bg-surface-900/40 p-4">
                <p className="text-sm font-medium text-zinc-300">Чат с клиентом</p>
                <div className="mt-3 max-h-48 space-y-2 overflow-y-auto text-sm">
                  {threadForDetail.map((m) => (
                    <div
                      key={m.id}
                      className={
                        m.from === 'manager'
                          ? 'text-zinc-300'
                          : 'text-brand-300/90'
                      }
                    >
                      <span className="text-xs text-zinc-500">
                        {m.from === 'manager' ? 'Менеджер' : 'Клиент'} ·{' '}
                        {formatDate(m.createdAt)}
                      </span>
                      <p className="mt-0.5">{m.body}</p>
                    </div>
                  ))}
                  {!threadForDetail.length && (
                    <p className="text-xs text-zinc-600">Пока нет сообщений в треде</p>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Textarea
                    label=""
                    placeholder="Ответ клиенту в чат…"
                    rows={2}
                    value={chatReply}
                    onChange={(e) => setChatReply(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    className="self-end shrink-0"
                    onClick={sendChat}
                  >
                    Отправить
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setDetail(null);
                    setChatReply('');
                  }}
                >
                  Закрыть
                </Button>
                <Button type="button" className="flex-1" onClick={saveDetail}>
                  Сохранить
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
