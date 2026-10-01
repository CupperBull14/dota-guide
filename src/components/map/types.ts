/** Что выбрано на карте: зона или объект-маркер. */
export type MapSelection = { kind: 'zone'; id: string } | { kind: 'marker'; id: string } | null;
