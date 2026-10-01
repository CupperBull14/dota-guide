import { RevealGroup, RevealItem } from '@/components/ui/Reveal';

/** Нумерованные советы по герою. */
export function HeroTips({ tips }: { tips: string[] }) {
  return (
    <RevealGroup as="ul" className="grid gap-4 md:grid-cols-3">
      {tips.map((tip, i) => (
        <RevealItem as="li" key={tip} className="panel flex gap-4 p-5">
          <span className="font-display text-3xl font-extrabold leading-none text-gold-gradient" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <p className="text-sm leading-relaxed text-ink-muted">{tip}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
