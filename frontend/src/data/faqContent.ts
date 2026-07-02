export type FaqItem = {
  q: string
  a: string
}

/** Разбор HTML из CMS: пары h2 + абзац(ы). */
export function parseFaqFromHtml(html: string): FaqItem[] {
  if (!html?.trim()) return []

  const doc = new DOMParser().parseFromString(html, 'text/html')
  const items: FaqItem[] = []

  doc.querySelectorAll('h2').forEach((heading) => {
    const q = heading.textContent?.trim() ?? ''
    const parts: string[] = []
    let node = heading.nextElementSibling

    while (node && node.tagName !== 'H2') {
      if (node.tagName === 'P') {
        const text = node.textContent?.trim()
        if (text) parts.push(text)
      }
      node = node.nextElementSibling
    }

    const a = parts.join(' ')
    if (q && a) items.push({ q, a })
  })

  return items
}

export const defaultFaqItems: FaqItem[] = [
  {
    q: 'Как оформить заказ на обед?',
    a: 'Оформите заказ в личном кабинете lk.smachnaya.ru или оставьте заявку на сайте — менеджер свяжется с вами и поможет с первым заказом.',
  },
  {
    q: 'До какого времени принимаются заказы?',
    a: 'Заказы на следующий день принимаются до 16:00. Корректировки по уже оформленным заказам — до 10:00 в день доставки.',
  },
  {
    q: 'Есть ли доставка по городу?',
    a: 'Да, доставляем корпоративные обеды по Санкт-Петербургу ежедневно с 11:00 до 18:00.',
  },
  {
    q: 'Можно ли заказать дегустацию?',
    a: 'Да. Оставьте заявку на главной странице — мы перезвоним и согласуем удобное время дегустации для вашей компании.',
  },
  {
    q: 'Что входит в комплексный обед?',
    a: 'Комплекс может включать салат, суп, горячее, гарнир, хлеб, приборы и салфетки. Состав и объёмы согласуются под задачи вашей компании.',
  },
  {
    q: 'Как изменить или отменить заказ?',
    a: 'Изменения и отмену можно внести в личном кабинете или по телефону до 10:00 в день доставки.',
  },
]

export const faqIntro =
  'Ответы на популярные вопросы о заказе, доставке и организации питания для вашей компании. Если не нашли нужное — свяжитесь с нами, мы поможем.'
