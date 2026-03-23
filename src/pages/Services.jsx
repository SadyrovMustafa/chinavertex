import { motion } from 'framer-motion';
import { ClipboardList, Factory, LineChart, Plane } from 'lucide-react';
import { Card } from '../components/ui/Card';

const blocks = [
  {
    icon: ClipboardList,
    title: 'Сбор требований',
    text: 'Фиксируем спецификацию, бюджет, сертификаты и рынок сбыта. Согласуем формат отчётов и канал связи.',
  },
  {
    icon: Factory,
    title: 'Производство и контроль',
    text: 'Согласование образцов, пилотная партия, контроль упаковки и маркировки под маркетплейсы.',
  },
  {
    icon: LineChart,
    title: 'Ценообразование',
    text: 'Прозрачная структура: себестоимость на фабрике, логистика, комиссия сервиса — без скрытых строк.',
  },
  {
    icon: Plane,
    title: 'Доставка',
    text: 'Подбор маршрута и перевозчика, страхование груза, трекинг и передача на ваш склад или фулфилмент.',
  },
];

export function Services() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <h1 className="text-3xl font-bold text-zinc-50 md:text-4xl">Услуги</h1>
        <p className="mt-4 text-lg text-zinc-400">
          ChinaVertex работает как ваш офис закупок в Китае: мы берём на себя поиск,
          переговоры, контроль исполнения и логистику — вы получаете предсказуемый
          результат и документы для бухгалтерии и таможни.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {blocks.map((b) => (
          <Card key={b.title} className="p-8">
            <b.icon className="h-12 w-12 text-brand-500" />
            <h2 className="mt-6 text-xl font-semibold text-zinc-100">{b.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{b.text}</p>
          </Card>
        ))}
      </div>

      <section className="mt-20 rounded-3xl border border-zinc-800 bg-surface-800/50 p-8 md:p-12">
        <h2 className="text-2xl font-bold text-zinc-50">Форматы работы</h2>
        <ul className="mt-6 space-y-4 text-zinc-400">
          <li>
            <strong className="text-zinc-200">Разовая закупка</strong> — под конкретный
            тендер или тест рынка.
          </li>
          <li>
            <strong className="text-zinc-200">Регулярные поставки</strong> — график
            производства и отгрузок, резерв мощностей на фабрике.
          </li>
          <li>
            <strong className="text-zinc-200">Сорсинг под задачу</strong> — по фото,
            ссылке или образцу: подбираем фабрику и выводим продукт в серию.
          </li>
        </ul>
      </section>
    </div>
  );
}
