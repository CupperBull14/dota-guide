/** Индикатор загрузки ленивой страницы. */
export function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <span className="relative grid h-12 w-12 place-items-center">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-gold/60" />
          <span className="h-3 w-3 rounded-full bg-gold" />
        </span>
        <span className="text-sm font-semibold text-ink-muted">Загрузка…</span>
      </div>
    </div>
  );
}
