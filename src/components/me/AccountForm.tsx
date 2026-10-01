import { useId, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ChevronDown, Search } from 'lucide-react';
import { parseAccountInput } from '@/lib/opendota';
import { Button } from '@/components/ui/Button';

const REASONS = {
  empty: 'Введи ID аккаунта или ссылку на профиль.',
  vanity:
    'Ссылку вида steamcommunity.com/id/имя нельзя перевести в ID без ключа Steam. Возьми Friend ID из клиента Dota или ссылку на Dotabuff/OpenDota.',
  invalid: 'Не похоже на ID аккаунта Dota. Нужны только цифры или ссылка на профиль.',
} as const;

interface AccountFormProps {
  initial?: string;
  busy?: boolean;
  onSubmit: (accountId: number) => void;
}

/** Ввод аккаунта: Friend ID, SteamID64 или ссылка на профиль. */
export function AccountForm({ initial = '', busy, onSubmit }: AccountFormProps) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const inputId = useId();
  const errorId = useId();
  const helpId = useId();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseAccountInput(value);
    if (!parsed.ok) {
      setError(REASONS[parsed.reason]);
      return;
    }
    setError(null);
    onSubmit(parsed.accountId);
  };

  return (
    <form onSubmit={submit} className="panel p-5" noValidate>
      <label htmlFor={inputId} className="mb-2 block font-bold">
        Твой аккаунт Dota 2
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Например, 123456789 или ссылка на Dotabuff"
          autoComplete="off"
          inputMode="text"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="h-11 flex-1 rounded-xl border border-line bg-bg-deep px-4 text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
        />
        <Button type="submit" variant="gold" disabled={busy} icon={<Search size={16} aria-hidden="true" />}>
          {busy ? 'Загружаю…' : 'Разобрать матчи'}
        </Button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex gap-2 text-sm text-[#f0a193]"
          >
            <AlertTriangle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setHelpOpen((v) => !v)}
        aria-expanded={helpOpen}
        aria-controls={helpId}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-gold-light hover:text-gold"
      >
        Где найти свой ID?
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={helpOpen ? 'rotate-180 transition-transform' : 'transition-transform'}
        />
      </button>
      <AnimatePresence initial={false}>
        {helpOpen && (
          <motion.div
            id={helpId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-ink-muted">
              <li>В клиенте Dota 2 открой свой профиль — под ником написан «Friend ID»: это и есть нужное число.</li>
              <li>
                Или найди себя на dotabuff.com / opendota.com и вставь ссылку на профиль целиком.
              </li>
              <li>
                Подойдёт и ссылка Steam вида steamcommunity.com/profiles/7656119… (с цифрами).
              </li>
              <li>
                Статистика видна, только если в настройках Dota 2 включено «Открыть доступ к данным матчей»
                (Expose Public Match Data).
              </li>
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
