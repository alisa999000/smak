/** Сериализация вложенных объектов для Commerce POST (как FormData). */
export function toFormData(obj: Record<string, unknown>, form?: FormData, namespace?: string): FormData {
  const fd = form ?? new FormData()
  for (const [key, value] of Object.entries(obj)) {
    const formKey = namespace ? `${namespace}[${key}]` : key
    if (value === null || value === undefined) continue
    if (value instanceof Date) {
      fd.append(formKey, value.toISOString())
    } else if (typeof value === 'object' && !(value instanceof File)) {
      toFormData(value as Record<string, unknown>, fd, formKey)
    } else {
      fd.append(formKey, String(value))
    }
  }
  return fd
}

export function commerceActionPayload(
  action: string,
  data: Record<string, unknown>,
  hashes: { carts?: string[]; form?: string } = {},
) {
  return toFormData({ action, data, hashes })
}
