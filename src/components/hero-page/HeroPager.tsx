import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Hero } from '@/types/hero';
import { HeroAvatar } from '@/components/heroes/HeroAvatar';

interface HeroPagerProps {
  prev: Hero;
  next: Hero;
}

/** Переход к соседним героям (по алфавиту, по кругу). */
export function HeroPager({ prev, next }: HeroPagerProps) {
  return (
    <nav aria-label="Другие герои" className="grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
      <Link
        to={`/heroes/${prev.id}`}
        className="panel group flex items-center gap-4 p-4 transition-[border-color,box-shadow] hover:border-gold/50 hover:shadow-glow-gold"
      >
        <ArrowLeft size={20} aria-hidden="true" className="text-gold transition-transform group-hover:-translate-x-1" />
        <HeroAvatar hero={prev} size="sm" />
        <span>
          <span className="block text-xs font-semibold text-ink-faint">Предыдущий</span>
          <span className="font-bold">{prev.name}</span>
        </span>
      </Link>
      <Link
        to={`/heroes/${next.id}`}
        className="panel group flex items-center justify-end gap-4 p-4 text-right transition-[border-color,box-shadow] hover:border-gold/50 hover:shadow-glow-gold"
      >
        <span>
          <span className="block text-xs font-semibold text-ink-faint">Следующий</span>
          <span className="font-bold">{next.name}</span>
        </span>
        <HeroAvatar hero={next} size="sm" />
        <ArrowRight size={20} aria-hidden="true" className="text-gold transition-transform group-hover:translate-x-1" />
      </Link>
    </nav>
  );
}
