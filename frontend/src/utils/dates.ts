export function formatDateShort(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0')
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  return `${dd} ${months[date.getMonth()]}`
}

export function formatDateAjax(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

export function weekDates(): Date[] {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const today = new Date()
  const dates = [yesterday, today]
  for (let i = 1; i <= 5; i++) {
    const d = new Date()
    d.setDate(today.getDate() + i)
    dates.push(d)
  }
  return dates
}

export function formatPrice(value: string | number | undefined): string {
  const parsed = parsePriceNumber(value)
  if (parsed === null) return ''
  return `${parsed.toLocaleString('ru-RU')} ₽`
}

export function parsePriceNumber(value: string | number | undefined): number | null {
  if (value === undefined || value === null || value === '') return null
  const cleaned = String(value).replace(/[^\d.,]/g, '').replace(',', '.')
  if (!cleaned) return null
  const n = Number(cleaned)
  return Number.isNaN(n) ? null : Math.round(n)
}

export function formatWeight(value: string | number | undefined): string {
  if (value === undefined || value === null || value === '') return ''
  const raw = String(value).trim()
  if (!raw) return ''
  if (/г\b|гр\b|gram/i.test(raw)) return raw
  const digits = raw.replace(/[^\d]/g, '')
  return digits ? `${digits} г` : raw
}

export function tvImage(path: string | undefined): string {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('/')) return path
  return `/${path.replace(/^\/+/, '')}`
}
