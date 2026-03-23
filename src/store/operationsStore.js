import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  SEED_QUOTE_REQUESTS,
  SEED_SOURCING_REQUESTS,
  SEED_ORDERS,
  SEED_THREAD_MESSAGES,
  SEED_PAYMENTS,
} from '../data/seed';
import { STATUS } from '../lib/constants';
import { uid } from '../lib/utils';

const SEED_MESSAGES = [
  {
    id: 'msg_1',
    userId: 'user_demo',
    body: 'Добрый день! По вашей заявке на наушники ждём КП от фабрики до конца недели.',
    from: 'manager',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'msg_2',
    userId: 'user_demo',
    body: 'Напоминаем: для таможни ЕС может понадобиться дополнительная маркировка — уточним вместе с образцами.',
    from: 'manager',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useOperationsStore = create(
  persist(
    (set, get) => ({
      quoteRequests: SEED_QUOTE_REQUESTS.map((r) => ({ ...r })),
      sourcingRequests: SEED_SOURCING_REQUESTS.map((r) => ({ ...r })),
      orders: SEED_ORDERS.map((o) => ({ ...o })),
      messages: [...SEED_MESSAGES],
      threadMessages: SEED_THREAD_MESSAGES.map((m) => ({ ...m })),
      payments: SEED_PAYMENTS.map((p) => ({ ...p })),

      addQuoteRequest: (payload) => {
        const id = uid('qr');
        const row = {
          id,
          userId: payload.userId,
          productId: payload.productId,
          productName: payload.productName,
          quantity: Number(payload.quantity),
          comment: (payload.comment || '').trim(),
          attachmentNote: (payload.attachmentNote || '').trim(),
          status: STATUS.NEW,
          managerNote: '',
          assignedManagerId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ quoteRequests: [row, ...s.quoteRequests] }));
        return id;
      },

      addSourcingRequest: (payload) => {
        const id = uid('sr');
        const row = {
          id,
          userId: payload.userId,
          productUrl: (payload.productUrl || '').trim(),
          description: (payload.description || '').trim(),
          quantity: Number(payload.quantity),
          imageDataUrl: payload.imageDataUrl || null,
          status: STATUS.NEW,
          managerNote: '',
          assignedManagerId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ sourcingRequests: [row, ...s.sourcingRequests] }));
        return id;
      },

      updateQuoteRequest: (id, patch) => {
        set((s) => ({
          quoteRequests: s.quoteRequests.map((r) =>
            r.id === id
              ? { ...r, ...patch, updatedAt: new Date().toISOString() }
              : r
          ),
        }));
      },

      updateSourcingRequest: (id, patch) => {
        set((s) => ({
          sourcingRequests: s.sourcingRequests.map((r) =>
            r.id === id
              ? { ...r, ...patch, updatedAt: new Date().toISOString() }
              : r
          ),
        }));
      },

      addOrder: (payload) => {
        const id = uid('ord');
        const row = {
          id,
          userId: payload.userId,
          title: payload.title.trim(),
          itemsSummary: payload.itemsSummary.trim(),
          status: payload.status || STATUS.PROCESSING,
          trackingNumber: payload.trackingNumber || null,
          relatedRequestId: payload.relatedRequestId || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          managerNote: payload.managerNote || '',
        };
        set((s) => ({ orders: [row, ...s.orders] }));
        return id;
      },

      updateOrder: (id, patch) => {
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id
              ? { ...o, ...patch, updatedAt: new Date().toISOString() }
              : o
          ),
        }));
      },

      addMessage: (userId, body, from = 'manager') => {
        const row = {
          id: uid('msg'),
          userId,
          body: body.trim(),
          from,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ messages: [row, ...s.messages] }));
      },

      getMessagesForUser: (userId) =>
        get()
          .messages.filter((m) => m.userId === userId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),

      addThreadMessage: ({ userId, contextType, contextId, from, body }) => {
        const row = {
          id: uid('tm'),
          userId,
          contextType,
          contextId,
          from,
          body: body.trim(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ threadMessages: [...s.threadMessages, row] }));
        return row.id;
      },

      getThreadMessages: (contextType, contextId) =>
        get()
          .threadMessages.filter(
            (m) => m.contextType === contextType && m.contextId === contextId
          )
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),

      addPayment: (payload) => {
        const id = uid('pay');
        const row = {
          id,
          userId: payload.userId,
          orderId: payload.orderId || null,
          title: payload.title.trim(),
          amountUsd: Number(payload.amountUsd),
          status: payload.status || 'pending',
          stage: (payload.stage || '').trim(),
          paymentMethod: payload.paymentMethod || null,
          receiptDataUrl: payload.receiptDataUrl || null,
          createdAt: new Date().toISOString(),
          paidAt: payload.status === 'paid' ? new Date().toISOString() : null,
        };
        set((s) => ({ payments: [row, ...s.payments] }));
        return id;
      },

      addOrderWithCryptoPayment: (payload) => {
        const orderId = uid('ord');
        const orderRow = {
          id: orderId,
          userId: payload.userId,
          title: payload.title.trim(),
          itemsSummary: payload.itemsSummary.trim(),
          productId: payload.productId || null,
          quantity: payload.quantity || null,
          amountUsd: Number(payload.amountUsd),
          paymentMethod: 'crypto_usdt_trc20',
          paymentScreenshot: payload.receiptDataUrl || null,
          status: STATUS.NEW,
          trackingNumber: null,
          relatedRequestId: payload.relatedRequestId || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          managerNote: '',
        };
        const payId = uid('pay');
        const payRow = {
          id: payId,
          userId: payload.userId,
          orderId,
          title: payload.paymentTitle || `Оплата USDT (TRC20) — ${payload.title}`,
          amountUsd: Number(payload.amountUsd),
          status: 'pending',
          stage: 'Ожидает подтверждения',
          paymentMethod: 'crypto_usdt_trc20',
          receiptDataUrl: payload.receiptDataUrl || null,
          createdAt: new Date().toISOString(),
          paidAt: null,
        };
        set((s) => ({
          orders: [orderRow, ...s.orders],
          payments: [payRow, ...s.payments],
        }));
        return orderId;
      },

      updatePayment: (id, patch) => {
        set((s) => ({
          payments: s.payments.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...patch,
                  receiptDataUrl: patch.receiptDataUrl !== undefined ? patch.receiptDataUrl : p.receiptDataUrl,
                  paidAt:
                    patch.status === 'paid'
                      ? patch.paidAt || new Date().toISOString()
                      : patch.paidAt !== undefined
                        ? patch.paidAt
                        : p.paidAt,
                }
              : p
          ),
        }));
      },
    }),
    {
      name: 'cv-operations',
      merge: (p, c) => ({
        ...c,
        ...p,
        threadMessages: Array.isArray(p?.threadMessages)
          ? p.threadMessages
          : c.threadMessages,
        payments: Array.isArray(p?.payments) ? p.payments : c.payments,
        quoteRequests: Array.isArray(p?.quoteRequests)
          ? p.quoteRequests
          : c.quoteRequests,
        sourcingRequests: Array.isArray(p?.sourcingRequests)
          ? p.sourcingRequests
          : c.sourcingRequests,
        orders: Array.isArray(p?.orders) ? p.orders : c.orders,
        messages: Array.isArray(p?.messages) ? p.messages : c.messages,
      }),
    }
  )
);
