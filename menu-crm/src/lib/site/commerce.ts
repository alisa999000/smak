import type { CartSession } from "@prisma/client";
import { productToSiteDocument, type ProductWithRelations } from "@/lib/site/mappers";

type CartSessionWithItems = CartSession & {
  items: Array<{
    id: string;
    count: number;
    instance: string;
    optionsJson: string;
    product: ProductWithRelations;
  }>;
};

export function cartPayload(session: CartSessionWithItems, instance = "products") {
  const items = session.items.filter((i) => i.instance === instance);
  let count = 0;
  let total = 0;
  const rows = items.map((item) => {
    const doc = productToSiteDocument(item.product);
    const price = item.product.price ? item.product.price.amountKop / 100 : 0;
    const rowTotal = price * item.count;
    count += item.count;
    total += rowTotal;
    let options: Record<string, string> = {};
    try {
      options = JSON.parse(item.optionsJson) as Record<string, string>;
    } catch {
      options = {};
    }
    return {
      row: item.id,
      id: doc.id,
      name: doc.pagetitle,
      count: item.count,
      price,
      total: rowTotal,
      options,
      url: doc.url,
      image: doc.tvs.image ?? "",
    };
  });

  return {
    ok: true,
    instance,
    hash: session.token,
    count,
    total,
    itemsPrice: total,
    rows,
  };
}

export const DELIVERY_METHODS = [{ code: "courier", title: "Доставка курьером" }];
export const PAYMENT_METHODS = [{ code: "cash", title: "Наличными при получении" }];
