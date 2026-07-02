/** Путь к фото блюда или null, если фото нет. */
export function resolveProductImage(path: string | undefined | null): string | null {
  const raw = String(path ?? '').trim()
  if (!raw) return null
  if (raw.startsWith('http') || raw.startsWith('/')) return raw
  return `/${raw.replace(/^\/+/, '')}`
}

export function hasProductImage(path: string | undefined | null): boolean {
  return resolveProductImage(path) !== null
}
