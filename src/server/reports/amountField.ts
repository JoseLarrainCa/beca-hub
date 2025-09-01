// AJUSTA a tu esquema real: 'amount' | 'amount_cents' | 'amountCents'
export const AMOUNT_FIELD = 'amount' as const;

// Helpers para construir selects dinámicos
export const sumSelect = () => ({ [AMOUNT_FIELD]: true } as any);
export const avgSelect = () => ({ [AMOUNT_FIELD]: true } as any);
export const amountFilter = (gte?: number, lte?: number) =>
  (gte || lte) ? ({ [AMOUNT_FIELD]: { gte, lte } } as any) : {};
export const readAmount = (row: any) => Number(row[AMOUNT_FIELD] ?? 0);
