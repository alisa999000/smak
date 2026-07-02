/** MODX URL `/menyu/goryachee.html` → Vue `/menyu/goryachee` */
export function docRoute(url: string | undefined): string {
  if (!url) return '/menyu'
  const path = url.replace(/\.html$/i, '')
  return path.startsWith('/') ? path : `/${path}`
}
