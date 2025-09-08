// src/utils/price.ts
export function toUnitPriceEUR(raw: any): number {
  if (raw == null) return 0
  if (typeof raw === 'number' && isFinite(raw)) return raw
  if (typeof raw === 'object') {
    if ('priceCents' in raw && isFinite(raw.priceCents)) return Number(raw.priceCents) / 100
    if ('amount' in raw && isFinite(raw.amount)) return Number(raw.amount)
    if ('value' in raw && isFinite(raw.value)) return Number(raw.value)
  }
  if (typeof raw === 'string') {
    const cleaned = raw.replace(/[€\s]/g, '').replace(',', '.')
    const n = Number(cleaned)
    return isFinite(n) ? n : 0
  }
  return 0
}
