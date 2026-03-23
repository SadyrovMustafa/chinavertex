import { motion } from 'framer-motion';
import { BarChart3, Factory, ShoppingBag, Store } from 'lucide-react';
import { Card } from '../components/ui/Card';

const cases = [
  {
    icon: Store,
    title: 'Маркетплейсы и D2C',
    summary:
      'Серийные SKU под Amazon, Ozon, Wildberries: упаковка, инструкции, сертификаты, стабильные партии.',
    metrics: [
      { label: 'Средний цикл КП → образец', value: '12–18 дней' },
      { label: 'Типичный MOQ при доработке', value: '500–2000 шт.' },
      { label: 'Экономия на переговорах', value: 'до 15% к первому офферу' },
    ],
    steps: [
      'Бриф и референсы → согласование спеки',
      '2–3 фабрики → КП и сроки',
      'Образцы → корректировка',
      'Пилотная партия → инспекция → масштаб',
    ],
  },
  {
    icon: ShoppingBag,
    title: 'Опт и розничные сети',
    summary:
      'Закупка под сезон и промо: несколько SKU в одном контейнере, единая логистика и документы.',
    metrics: [
      { label: 'Консолидация груза', value: 'от 2 поставщиков' },
      { label: 'Планирование отгрузки', value: 'FOB / CIF под задачу' },
      { label: 'Контроль качества', value: 'AQL по договору' },
    ],
    steps: [
      'Корзина закупки и приоритеты по срокам',
      'Согласование цен и графика производства',
      'Предоплата и постановка в производство',
      'Инспекция и отгрузка в порт / на склад РФ',
    ],
  },
  {
    icon: Factory,
    title: 'Промышленность и компоненты',
    summary:
      'Заказные детали, кабельные жгуты, металлообработка: чертежи, допуски, серийность и повторяемость партий.',
    metrics: [
      { label: 'Первый образец', value: '21–35 дней' },
      { label: 'Партии', value: 'от 200 ед. и выше' },
      { label: 'Документация', value: 'спеки, протоколы, фотоотчёты' },
    ],
    steps: [
      'Техническое задание и образец (если есть)',
      'Выбор фабрики по мощностям и опыту',
      'Пробная партия и калибровка процесса',
      'Серийное производство и входной контроль',
    ],
  },
];

export function Cases() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <div className="flex items-center gap-3 text-brand-400">
          <BarChart3 className="h-8 w-8" />
          <span className="text-sm font-semibold uppercase tracking-wide">
            Кейсы и отрасли
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-zinc-50 md:text-4xl">
          Типовые сценарии закупок из Китая
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Цифры ориентировочные, зависят от категории и загрузки фабрик. На консультации
          закрепим сроки и этапы под ваш SKU.
        </p>
      </motion.div>

      <div className="mt-14 space-y-12">
        {cases.map((c, i) => (
          <motion.section
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="overflow-hidden p-0 md:flex">
              <div className="flex flex-1 flex-col border-b border-zinc-800 p-8 md:border-b-0 md:border-r">
                <c.icon className="h-12 w-12 text-brand-500" />
                <h2 className="mt-6 text-2xl font-bold text-zinc-100">{c.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{c.summary}</p>
                <ol className="mt-8 space-y-3 text-sm text-zinc-300">
                  {c.steps.map((step, j) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600/30 text-xs font-bold text-brand-300">
                        {j + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="flex w-full shrink-0 flex-col justify-center gap-4 bg-surface-900/50 p-8 md:w-72">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Ориентиры
                </p>
                {c.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-zinc-800 bg-surface-800/80 px-4 py-3"
                  >
                    <p className="text-xs text-zinc-500">{m.label}</p>
                    <p className="mt-1 font-semibold text-brand-300">{m.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
