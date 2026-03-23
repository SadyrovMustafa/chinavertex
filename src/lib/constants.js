/** Заявки и заказы — единая шкала статусов */
export const STATUS = {
  NEW: 'new',
  PROCESSING: 'processing',
  SUPPLIER_FOUND: 'supplier_found',
  PRODUCTION: 'production',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
};

export const STATUS_META = {
  [STATUS.NEW]: {
    label: 'Новая',
    className: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  },
  [STATUS.PROCESSING]: {
    label: 'В обработке',
    className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  [STATUS.SUPPLIER_FOUND]: {
    label: 'Найден поставщик',
    className: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  },
  [STATUS.PRODUCTION]: {
    label: 'Производство',
    className: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  },
  [STATUS.SHIPPED]: {
    label: 'Отправлено',
    className: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  },
  [STATUS.COMPLETED]: {
    label: 'Завершено',
    className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
};

export const ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin',
  MANAGER: 'manager',
};

/** Адрес кошелька USDT (TRC20) для приёма оплаты — замените на свой */
export const CRYPTO_USDT_TRC20_ADDRESS =
  'TYourWalletAddressForUSDT_TRC20_ReplaceMe';
