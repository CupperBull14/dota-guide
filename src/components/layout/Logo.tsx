import { Link } from 'react-router-dom';

/** Логотип-ссылка на главную. */
export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="group flex items-center gap-2.5"
      aria-label="Dota Guide — на главную"
    >
      <svg viewBox="0 0 64 64" className="h-9 w-9 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105" aria-hidden="true">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e0543f" />
            <stop offset="1" stopColor="#8e2a1d" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="#151a23" stroke="#2f3a4b" />
        <path d="M14 12h18l18 18v22H32L14 34z" fill="url(#logo-g)" />
        <path d="M20 20l24 24" stroke="#c8aa6e" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <span className="font-display text-lg font-bold tracking-wider text-ink">
        Dota <span className="text-gold-gradient">Guide</span>
      </span>
    </Link>
  );
}
