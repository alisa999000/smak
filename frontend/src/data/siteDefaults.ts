/** Контакты и тексты по ТЗ «Доработка сайта.pptx». */

export const DEFAULT_PHONE = '+7 (911) 792-48-29'
export const DEFAULT_PHONE_TEL = '79117924829'
export const DEFAULT_HOURS = 'Ежедневно, без выходных'
export const DEFAULT_ORDER_DEADLINE = 'Заказы до 16:00'
export const ORDER_ACCEPT_UNTIL = '16:00'
export const DEFAULT_EMAIL = 'smachnayatochka@mail.ru'
export const DEFAULT_EMAIL_NOTIFY = 'syasik13@gmail.com'
export const ORDER_SYSTEM_URL = 'https://lk.smachnaya.ru'

export const HEADER_NAV = [
  { label: 'Меню', to: '/menyu' },
  { label: 'Акции', to: '/akcii' },
  { label: 'О компании', to: '/company' },
  { label: 'Новости', to: '/novosti' },
  { label: 'FAQ', to: '/chasto-zadavaemy-voprosy' },
  { label: 'Контакты', to: '/kontakty' },
] as const
