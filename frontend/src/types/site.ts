export interface SiteConfig {
  ok: boolean
  siteName: string
  siteUrl: string
  phone: string
  email?: string
  notifyEmail?: string
  hours: string
  orderDeadline?: string
  orderSystemUrl?: string
  company?: CompanyDetails
  csrfToken: string
  loginUrl: string
  registerUrl: string
  accountUrl: string
  cartUrl: string
  wishlistUrl: string
  checkoutUrl: string
  menuRootId: number
  newsRootId: number
}

export interface CompanyDetails {
  name: string
  inn: string
  ogrnip: string
  account: string
  bank: string
  bik: string
  corrAccount: string
  addressActual: string
  addressLegal: string
}

export interface DocumentTv {
  image?: string
  price?: string
  massa?: string
  sostav?: string
  action?: string
  new?: string
  hit?: string
  phone_number?: string
  hour?: string
  [key: string]: string | undefined
}

export interface SiteDocument {
  id: number
  parent: number
  pagetitle: string
  longtitle: string
  description: string
  alias: string
  introtext: string
  content: string
  published: boolean
  template: number
  menuindex: number
  isfolder: boolean
  url: string
  tvs: DocumentTv
  breadcrumbs?: Breadcrumb[]
}

export interface Breadcrumb {
  id: number
  pagetitle: string
  url: string
}

export interface MenuDayItem {
  name: string
  description: string
  price: string
  weight: string
  image: string
}

export interface Banner {
  image: string
  title: string
  text: string
  link: string
}

export interface CartRow {
  id: number
  row: string
  name: string
  count: number
  price: number
  total: number
  url: string
  image: string
  options: Record<string, string>
}

export interface CartState {
  hash: string
  count: number
  total: number
  itemsPrice: number
  rows: CartRow[]
}
