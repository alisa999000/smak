import type { Banner, Category, Page, Price, Product, ProductImage, SiteSettings } from "@prisma/client";

export type ProductWithRelations = Product & {
  category: Category;
  price: Price | null;
  images: ProductImage[];
};

const MENU_ROOT_ID = 2;
const NEWS_ROOT_ID = 36;

export function publicId(legacyModxId: number | null | undefined, fallback: string): number {
  if (legacyModxId != null) return legacyModxId;
  let hash = 0;
  for (let i = 0; i < fallback.length; i++) {
    hash = (hash * 31 + fallback.charCodeAt(i)) >>> 0;
  }
  return 100_000 + (hash % 900_000);
}

export function docUrl(slug: string, parentSlug?: string | null): string {
  if (slug === "menyu") return "/menyu.html";
  if (parentSlug === "menyu") return `/menyu/${slug}.html`;
  if (parentSlug) return `/${parentSlug}/${slug}.html`;
  return `/${slug}.html`;
}

export function productUrl(categorySlug: string, productSlug: string): string {
  return `/menyu/${categorySlug}/${productSlug}.html`;
}

export function pageToSiteDocument(page: Page, breadcrumbs?: Array<{ id: number; pagetitle: string; url: string }>) {
  return {
    id: publicId(page.legacyModxId, page.id),
    parent: page.parentSlug === "menyu" ? MENU_ROOT_ID : page.parentSlug ? 0 : 0,
    pagetitle: page.pagetitle,
    longtitle: page.longtitle,
    description: page.description,
    alias: page.slug,
    introtext: page.introtext,
    content: page.content,
    published: page.published,
    template: page.template,
    menuindex: page.menuindex,
    isfolder: page.isfolder,
    url: docUrl(page.slug, page.parentSlug),
    tvs: {} as Record<string, string>,
    breadcrumbs,
  };
}

export function categoryToSiteDocument(category: Category) {
  return {
    id: publicId(category.legacyModxId, category.id),
    parent: MENU_ROOT_ID,
    pagetitle: category.name,
    longtitle: "",
    description: "",
    alias: category.slug,
    introtext: "",
    content: "",
    published: true,
    template: 10,
    menuindex: category.sortOrder,
    isfolder: true,
    url: docUrl(category.slug, "menyu"),
    tvs: {} as Record<string, string>,
    breadcrumbs: [
      { id: MENU_ROOT_ID, pagetitle: "Меню", url: "/menyu.html" },
      { id: publicId(category.legacyModxId, category.id), pagetitle: category.name, url: docUrl(category.slug, "menyu") },
    ],
  };
}

export function productToSiteDocument(product: ProductWithRelations) {
  const priceRub = product.price ? (product.price.amountKop / 100).toFixed(0) : "";
  const image = product.images[0]?.path ?? "";
  return {
    id: publicId(product.legacyModxId, product.id),
    parent: publicId(product.category.legacyModxId, product.category.id),
    pagetitle: product.name,
    longtitle: "",
    description: product.description,
    alias: product.slug,
    introtext: product.description,
    content: product.composition,
    published: product.published,
    template: 3,
    menuindex: 0,
    isfolder: false,
    url: productUrl(product.category.slug, product.slug),
    tvs: {
      price: priceRub,
      image,
      massa: product.weightGrams ? String(product.weightGrams) : "",
      sostav: product.composition,
    },
    breadcrumbs: [
      { id: MENU_ROOT_ID, pagetitle: "Меню", url: "/menyu.html" },
      {
        id: publicId(product.category.legacyModxId, product.category.id),
        pagetitle: product.category.name,
        url: docUrl(product.category.slug, "menyu"),
      },
      {
        id: publicId(product.legacyModxId, product.id),
        pagetitle: product.name,
        url: productUrl(product.category.slug, product.slug),
      },
    ],
  };
}

export function bannerToSite(banner: Banner) {
  return {
    image: banner.image,
    title: banner.title,
    text: banner.text,
    link: banner.link,
  };
}

export function settingsToConfig(settings: SiteSettings, csrfToken: string) {
  let company: Record<string, string> = {};
  try {
    company = JSON.parse(settings.companyJson) as Record<string, string>;
  } catch {
    company = {};
  }
  return {
    ok: true,
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
    phone: settings.phone,
    email: settings.email,
    notifyEmail: settings.notifyEmail,
    hours: settings.hours,
    orderDeadline: settings.orderDeadline,
    orderSystemUrl: settings.orderSystemUrl,
    company,
    csrfToken,
    loginUrl: "/account/avtorizaciya.html",
    registerUrl: "/account/registraciya.html",
    accountUrl: "/account.html",
    cartUrl: "/korzina.html",
    wishlistUrl: "/izbrannoe.html",
    checkoutUrl: "/oformlenie-zakaza.html",
    menuRootId: settings.menuRootId,
    newsRootId: settings.newsRootId,
  };
}

export { MENU_ROOT_ID, NEWS_ROOT_ID };
