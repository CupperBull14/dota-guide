/** Склейка className: отбрасывает пустые и ложные значения. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
