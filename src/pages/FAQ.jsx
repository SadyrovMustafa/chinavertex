import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const faqItems = [
  {
    q: 'Что такое MOQ и можно ли его снизить?',
    a: 'MOQ (Minimum Order Quantity) — минимальный заказ на фабрике. Снизить можно за счёт объединения с другим клиентом, упрощения кастомизации или выбора другой фабрики. Мы заранее проговариваем реальный минимум до оплаты образцов.',
  },
  {
    q: 'Какие сроки от запроса до отгрузки?',
    a: 'Зависит от категории: КП по готовым позициям из каталога — часто 3–7 рабочих дней; sourcing с поиском фабрики — 2–4 недели до образцов; производство под заказ — от 4 недель плюс логистика. В личном кабинете фиксируем этапы и статусы.',
  },
  {
    q: 'Сертификаты (CE, RoHS и др.) — кто отвечает?',
    a: 'Фабрика предоставляет тест-репорты и декларации; мы проверяем соответствие вашему рынку сбыта. При необходимости подключаем аккредитованные лаборатории — это отдельная строка в смете и согласуется до производства.',
  },
  {
    q: 'Таможня и доставка: что входит в сервис?',
    a: 'Мы готовим пакет для перевозчика и покупателя: инвойс, упаковочный лист, HS-коды по согласованию. Таможенный брокер в стране назначения обычно на стороне импортёра; при необходимости рекомендуем партнёров.',
  },
  {
    q: 'Как проходит оплата фабрике?',
    a: 'Типично: предоплата за запуск (30–50%), баланс перед отгрузкой или по BL. Платежи идут на юрлицо фабрики или через согласованный канал; мы не принимаем оплату «в конверте». Этапы фиксируются в договоре и в mock-истории платежей в кабинете.',
  },
  {
    q: 'Как контролируется качество?',
    a: 'По договорённости: инспекция на линии, выборочная проверка AQL, фото/видео упаковки. Результаты можно обсуждать в чате по конкретной заявке или заказу.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-zinc-50 md:text-4xl">
          Частые вопросы
        </h1>
        <p className="mt-3 text-zinc-400">
          MOQ, сроки, сертификаты, таможня и оплата — кратко по процессу ChinaVertex.
        </p>
      </motion.div>

      <ul className="mt-10 space-y-2">
        {faqItems.map((item, i) => {
          const isOpen = open === i;
          return (
            <li
              key={item.q}
              className="overflow-hidden rounded-2xl border border-zinc-800 bg-surface-800/60"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-zinc-100 transition hover:bg-surface-700/40"
              >
                {item.q}
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-zinc-500 transition',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="border-t border-zinc-800 px-5 pb-4 pt-2 text-sm leading-relaxed text-zinc-400">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
