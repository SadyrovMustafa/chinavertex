import { STATUS, ROLES } from '../lib/constants';

export const SEED_CATEGORIES = [
  { id: 'cat_electronics', name: 'Электроника', slug: 'electronics' },
  { id: 'cat_textile', name: 'Текстиль и одежда', slug: 'textile' },
  { id: 'cat_home', name: 'Товары для дома', slug: 'home' },
  { id: 'cat_industrial', name: 'Промышленные компоненты', slug: 'industrial' },
  { id: 'cat_packaging', name: 'Упаковка и этикетки', slug: 'packaging' },
];

export const SEED_PRODUCTS = [
  {
    id: 'prod_tws',
    name: 'Беспроводные наушники TWS с шумоподавлением',
    description:
      'Готовая конфигурация для брендирования: коробка, инструкция, зарядный кейс USB-C. Поддержка Bluetooth 5.3, время работы до 28 часов с кейсом. Подходит для маркетплейсов и офлайн-ритейла.',
    priceUsd: 8.9,
    moq: 500,
    categoryId: 'cat_electronics',
    image:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
  },
  {
    id: 'prod_cable',
    name: 'Кабели USB-C / Lightning оптом',
    description:
      'Сертифицированные кабели разной длины (0.5–2 м), нейлоновая оплётка, тест на 10 000 изгибов. Цвета и логотип по запросу при MOQ от 2000 шт.',
    priceUsd: 0.85,
    moq: 2000,
    categoryId: 'cat_electronics',
    image:
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',
  },
  {
    id: 'prod_hoodie',
    name: 'Худи оверсайз, хлопок/полиэстер',
    description:
      'Крой оверсайз, флис внутри, плотность 320 г/м². Размерная сетка EU/US. Возможны вышивка, печать, бирки и упаковка под ваш бренд.',
    priceUsd: 12.4,
    moq: 300,
    categoryId: 'cat_textile',
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
  },
  {
    id: 'prod_mug',
    name: 'Керамические кружки сублимация',
    description:
      'Объём 330 мл, покрытие для сублимации, белая база. Упаковка в гофру на поддоне. Подходит для корпоративных заказов и сувенирной линейки.',
    priceUsd: 1.15,
    moq: 1000,
    categoryId: 'cat_home',
    image:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
  },
  {
    id: 'prod_motor',
    name: 'Бесщеточные моторы NEMA 17',
    description:
      'Для 3D-принтеров и ЧПУ: шаг 1.8°, держатель вала 5 мм, номинальное напряжение 12–24 В. Серийное производство, стабильные партии.',
    priceUsd: 4.2,
    moq: 200,
    categoryId: 'cat_industrial',
    image:
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
  },
  {
    id: 'prod_boxes',
    name: 'Коробки крафт с логотипом',
    description:
      'Микрогофра, FSC-сертификат по запросу. Дизайн дна и крышки, внутренние вставки. Срок отладки макета 5–7 рабочих дней.',
    priceUsd: 0.45,
    moq: 5000,
    categoryId: 'cat_packaging',
    image:
      'https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=800&q=80',
  },
];

const now = Date.now();

export const SEED_USERS = [
  {
    id: 'user_admin',
    email: 'admin@chinvertex.demo',
    password: 'admin123',
    name: 'Администратор ChinaVertex',
    company: 'ChinaVertex',
    role: ROLES.ADMIN,
    phone: '+86 400 000 0000',
    createdAt: new Date(now - 86400000 * 30).toISOString(),
  },
  {
    id: 'user_manager',
    email: 'manager@chinvertex.demo',
    password: 'manager123',
    name: 'Елена Смирнова',
    company: 'ChinaVertex',
    role: ROLES.MANAGER,
    phone: '+86 138 0000 0001',
    createdAt: new Date(now - 86400000 * 20).toISOString(),
  },
  {
    id: 'user_demo',
    email: 'client@demo.com',
    password: 'demo123',
    name: 'Иван Петров',
    company: 'ООО «СеверИмпорт»',
    role: ROLES.CLIENT,
    phone: '+7 900 123-45-67',
    createdAt: new Date(now - 86400000 * 5).toISOString(),
  },
];

export const SEED_QUOTE_REQUESTS = [
  {
    id: 'qr_1',
    userId: 'user_demo',
    productId: 'prod_tws',
    productName: 'Беспроводные наушники TWS с шумоподавлением',
    quantity: 800,
    comment: 'Нужна упаковка под наш бренд, сертификаты для ЕС.',
    attachmentNote: 'https://example.com/brand-guidelines.pdf',
    status: STATUS.PROCESSING,
    managerNote:
      'Запросили образцы у двух фабрик в Шэньчжэне. Ответ до пятницы.',
    assignedManagerId: 'user_manager',
    createdAt: new Date(now - 86400000 * 3).toISOString(),
    updatedAt: new Date(now - 86400000).toISOString(),
  },
];

export const SEED_SOURCING_REQUESTS = [
  {
    id: 'sr_1',
    userId: 'user_demo',
    productUrl: 'https://example.com/marketplace/item/88291',
    description:
      'Аналог этого товара с металлическим корпусом и сертификатом CE.',
    quantity: 1200,
    imageDataUrl: null,
    status: STATUS.SUPPLIER_FOUND,
    managerNote: 'Найдены 3 поставщика в Дунгуане, ждём образцы.',
    assignedManagerId: 'user_manager',
    createdAt: new Date(now - 86400000 * 6).toISOString(),
    updatedAt: new Date(now - 86400000 * 2).toISOString(),
  },
];

export const SEED_ORDERS = [
  {
    id: 'ord_1',
    userId: 'user_demo',
    title: 'Партия USB-C кабелей — бренд СеверИмпорт',
    itemsSummary: 'Кабели 1 м, нейлон, чёрный, логотип на коннекторе',
    status: STATUS.PRODUCTION,
    trackingNumber: null,
    relatedRequestId: 'qr_1',
    createdAt: new Date(now - 86400000 * 10).toISOString(),
    updatedAt: new Date(now - 86400000 * 1).toISOString(),
    managerNote: 'Производство стартовало, контроль качества на линии.',
  },
];

export const SEED_FAVORITES = {
  user_demo: ['prod_motor', 'prod_boxes'],
};

/** Треды чата: привязка к заявке (quote/sourcing) или заказу */
export const SEED_THREAD_MESSAGES = [
  {
    id: 'tm_1',
    userId: 'user_demo',
    contextType: 'quote',
    contextId: 'qr_1',
    from: 'manager',
    body: 'Добрый день! По заявке на TWS ждём коммерческое предложение от двух фабрик в Шэньчжэне до конца недели.',
    createdAt: new Date(now - 86400000 * 2.5).toISOString(),
  },
  {
    id: 'tm_2',
    userId: 'user_demo',
    contextType: 'quote',
    contextId: 'qr_1',
    from: 'client',
    body: 'Спасибо. Нужны также образцы упаковки и вариант с логотипом на кейсе.',
    createdAt: new Date(now - 86400000 * 2).toISOString(),
  },
  {
    id: 'tm_3',
    userId: 'user_demo',
    contextType: 'order',
    contextId: 'ord_1',
    from: 'manager',
    body: 'Партия кабелей на линии, первая инспекция запланирована на четверг. Отчёт пришлём в чат.',
    createdAt: new Date(now - 86400000 * 2).toISOString(),
  },
];

/** Mock платежей по этапам заказа */
export const SEED_PAYMENTS = [
  {
    id: 'pay_1',
    userId: 'user_demo',
    orderId: 'ord_1',
    title: 'Предоплата 30% за запуск производства',
    amountUsd: 4800,
    status: 'paid',
    stage: 'Производство',
    createdAt: new Date(now - 86400000 * 12).toISOString(),
    paidAt: new Date(now - 86400000 * 11).toISOString(),
  },
  {
    id: 'pay_2',
    userId: 'user_demo',
    orderId: 'ord_1',
    title: 'Промежуточный платёж 40%',
    amountUsd: 6400,
    status: 'paid',
    stage: 'Производство',
    createdAt: new Date(now - 86400000 * 8).toISOString(),
    paidAt: new Date(now - 86400000 * 7).toISOString(),
  },
  {
    id: 'pay_3',
    userId: 'user_demo',
    orderId: 'ord_1',
    title: 'Баланс перед отгрузкой',
    amountUsd: 5600,
    status: 'pending',
    stage: 'Отгрузка',
    createdAt: new Date(now - 86400000 * 3).toISOString(),
    paidAt: null,
  },
];

export const SEED_RESPONSE_TEMPLATES = [
  {
    id: 'tpl_1',
    title: 'КП в работе',
    context: 'quote',
    suggestedStatus: 'processing',
    body: 'Запросили коммерческое предложение у проверенных фабрик. Ориентировочный ответ в течение 2–3 рабочих дней.',
  },
  {
    id: 'tpl_2',
    title: 'Нужны уточнения по MOQ',
    context: 'quote',
    body: 'Уточните, пожалуйста, целевую партию и допустимый диапазон MOQ — так мы сможем быстрее согласовать цену с фабрикой.',
  },
  {
    id: 'tpl_3',
    title: 'Sourcing: поставщики найдены',
    context: 'sourcing',
    suggestedStatus: 'supplier_found',
    body: 'Подобрали несколько фабрик по вашему описанию. Готовим сравнение по цене, сроку и условиям образцов.',
  },
  {
    id: 'tpl_4',
    title: 'Общий: ожидайте обновление',
    context: 'any',
    body: 'Приняли информацию, менеджер свяжется с вами при появлении нового статуса по сделке.',
  },
];

export const SEED_SUPPLIERS = [
  {
    id: 'sup_1',
    name: 'Shenzhen AudioTech Co.',
    city: 'Шэньчжэнь',
    contactPerson: 'Г-н Ван',
    phone: '+86 755 1234 5678',
    wechat: 'audio_wang_sz',
    email: 'sales@audio-tech-mock.cn',
    notes: 'TWS и аксессуары, хорошо идут на сертификацию CE. MOQ от 500.',
    tags: 'электроника, audio',
  },
  {
    id: 'sup_2',
    name: 'Dongguan CableWorks',
    city: 'Дунгуань',
    contactPerson: 'Мисс Ли',
    phone: '+86 769 9876 5432',
    wechat: 'cable_li_dg',
    email: 'export@cableworks-mock.cn',
    notes: 'Кабели USB-C/Lightning, кастомная оплётка. Просят 2 недели на первый образец.',
    tags: 'кабели, OEM',
  },
];
