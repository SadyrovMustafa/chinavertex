import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  PackageSearch,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const features = [
  {
    icon: PackageSearch,
    title: 'Сорсинг и подбор фабрик',
    text: 'Проверяем производителей по вашему ТЗ, запрашиваем образцы и коммерческие предложения.',
  },
  {
    icon: ShieldCheck,
    title: 'Контроль качества',
    text: 'Инспекции на линии, AQL-проверки и фото/видео отчёты перед отгрузкой.',
  },
  {
    icon: Truck,
    title: 'Логистика и таможня',
    text: 'Консолидация груза, море/авиа/ж/д, сопровождение документов для ЕС и СНГ.',
  },
  {
    icon: Globe2,
    title: 'Единое окно',
    text: 'Один менеджер ведёт заявку от запроса цены до получения товара на складе.',
  },
];

export function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-surface-900 to-surface-900" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:flex lg:items-center lg:gap-16 lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <p className="text-sm font-medium uppercase tracking-widest text-brand-400">
              B2B закупки из Китая
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-balance text-zinc-50 md:text-5xl">
              Поставщики, качество и доставка под ключ
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              ChinaVertex соединяет ваш бизнес с проверенными фабриками: от поиска
              товара и переговоров до инспекции партии и трекинга до вашего склада.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/catalog">
                <Button size="lg">
                  Смотреть каталог
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">
                  Создать аккаунт
                </Button>
              </Link>
            </div>
            <ul className="mt-12 space-y-3 text-sm text-zinc-400">
              {['Минимальные сроки ответа по заявкам', 'Прозрачные этапы и статусы', 'Работа по договору и оферте'].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-500" />
                    {t}
                  </li>
                )
              )}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="mt-14 hidden flex-1 lg:mt-0 lg:block"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-zinc-800 shadow-glow">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80"
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-900/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-zinc-700/80 bg-surface-900/80 p-4 backdrop-blur-md">
                <p className="text-sm font-medium text-zinc-200">
                  Средняя экономия времени на закупке
                </p>
                <p className="mt-1 text-2xl font-bold text-brand-400">до 40%</p>
                <p className="text-xs text-zinc-500">за счёт выстроенного процесса и локальных команд</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <h2 className="text-center text-2xl font-bold text-zinc-100 md:text-3xl">
          Что входит в сервис
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
          Полный цикл для импортёров и селлеров: от запроса цены на готовую позицию
          до индивидуального сорсинга по фото и ссылке.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Card key={f.title} hover className="p-6">
              <f.icon className="h-10 w-10 text-brand-500" />
              <h3 className="mt-4 font-semibold text-zinc-100">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-surface-800/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 text-center lg:flex-row lg:justify-between lg:px-8 lg:text-left">
          <div>
            <h2 className="text-2xl font-bold text-zinc-50 md:text-3xl">
              Нужен товар, которого нет в каталоге?
            </h2>
            <p className="mt-3 max-w-xl text-zinc-400">
              Отправьте sourcing-запрос: фото, ссылку и количество — мы найдём
              фабрику и вернёмся с условиями и сроками.
            </p>
          </div>
          <Link to="/sourcing">
            <Button size="lg">
              Запросить поиск
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-zinc-800 bg-surface-800/40 p-6 sm:flex-row sm:p-8">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-brand-400">Материалы для решения</p>
            <h2 className="mt-1 text-xl font-semibold text-zinc-100">
              Кейсы по отраслям и ответы на частые вопросы
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-500">
              Цифры по срокам, MOQ, сертификатам и оплате фабрике — без воды.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/cases">
              <Button variant="secondary" size="lg">
                Кейсы и отрасли
              </Button>
            </Link>
            <Link to="/faq">
              <Button size="lg">
                FAQ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
