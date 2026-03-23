import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-surface-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
              CV
            </span>
            <span className="text-lg font-semibold">ChinaVertex</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Поиск фабрик и поставщиков в Китае, выкуп товара, инспекции качества и
            доставка до вашего склада. Работаем с B2B и маркетплейсами.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Навигация
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/catalog" className="text-zinc-300 hover:text-brand-400">
                Каталог
              </Link>
            </li>
            <li>
              <Link to="/cases" className="text-zinc-300 hover:text-brand-400">
                Кейсы и отрасли
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-zinc-300 hover:text-brand-400">
                Услуги
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-zinc-300 hover:text-brand-400">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-zinc-300 hover:text-brand-400">
                Контакты
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-zinc-300 hover:text-brand-400">
                Личный кабинет
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Контакты
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-300">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <span>Шэньчжэнь, район Наньшань, деловой центр ChinaVertex</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <a href="mailto:hello@chinvertex.com" className="hover:text-brand-400">
                hello@chinvertex.com
              </a>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <span>+86 755 0000 0000 (WeChat / WhatsApp)</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} ChinaVertex. Все права защищены.
      </div>
    </footer>
  );
}
