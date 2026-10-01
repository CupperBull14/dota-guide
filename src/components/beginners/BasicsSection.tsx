import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BASICS } from '@/data/beginners';
import { BASICS_ICONS } from '@/lib/icons';
import { Accordion } from '@/components/ui/Accordion';

/** Основы игры в аккордеоне: у каждой темы иконка, вводная и ключевые пункты. */
export function BasicsSection() {
  return (
    <Accordion
      multiple
      defaultOpen={['goal']}
      items={BASICS.map((topic) => {
        const Icon = BASICS_ICONS[topic.icon];
        return {
          id: topic.id,
          title: (
            <span className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gold/10 text-gold">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span>{topic.title}</span>
            </span>
          ),
          content: (
            <div className="space-y-3">
              <p className="text-ink">{topic.lead}</p>
              <ul className="list-disc space-y-1.5 pl-5 text-sm marker:text-gold">
                {topic.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {topic.link && (
                <Link
                  to={topic.link.to}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-gold-light hover:text-gold"
                >
                  {topic.link.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              )}
            </div>
          ),
        };
      })}
    />
  );
}
