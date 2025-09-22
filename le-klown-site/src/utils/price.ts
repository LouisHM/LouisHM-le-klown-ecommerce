// src/utils/price.ts
export function toUnitPriceEUR(raw: any): number {
  if (raw == null) return 0
  if (typeof raw === 'number' && isFinite(raw)) return raw
  if (typeof raw === 'object') {
    if ('priceCents' in raw && isFinite((raw as any).priceCents)) return Number((raw as any).priceCents) / 100
    if ('amount' in raw && isFinite((raw as any).amount)) return Number((raw as any).amount)
    if ('value' in raw && isFinite((raw as any).value)) return Number((raw as any).value)
  }
  if (typeof raw === 'string') {
    const cleaned = raw.replace(/[€\s]/g, '').replace(',', '.')
    const n = Number(cleaned)
    return isFinite(n) ? n : 0
  }
  return 0
}

// Optional helper if you ever need a string like "12,34 €"
export function formatPriceEUR(raw: any): string {
  const n = toUnitPriceEUR(raw)
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}
