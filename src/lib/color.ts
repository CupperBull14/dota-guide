/** Осветляет hex-цвет, смешивая его с белым (amount 0–1). Нужно для читаемого текста цвета атрибута. */
export function lighten(hex: string, amount: number): string {
  const h = hex.replace('#', '');
  const mix = (i: number) => {
    const c = parseInt(h.slice(i, i + 2), 16);
    return Math.round(c + (255 - c) * amount)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${mix(0)}${mix(2)}${mix(4)}`;
}
