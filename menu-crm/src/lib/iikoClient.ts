export type IikoNom = {
  groups?: Array<{ id?: string; name?: string; parentGroup?: string | null; isDeleted?: boolean }>;
  /** Категории товара (часть дерева номенклатуры); имена сюда тоже смотреть. */
  productCategories?: Array<{
    id?: string;
    name?: string;
    parentGroup?: string | null;
    isDeleted?: boolean;
  }>;
  products?: Array<{
    id?: string;
    name?: string;
    description?: string;
    type?: string;
    isDeleted?: boolean;
    groupId?: string;
    parentGroup?: string;
    weight?: number;
    sizePrices?: Array<{ sizeId?: string; price?: { currentPrice?: number } }>;
    imageLinks?: string[];
  }>;
};

async function iikoAccessToken(base: string, login: string): Promise<string> {
  const tokenRes = await fetch(`${base}/api/1/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiLogin: login }),
  });
  if (!tokenRes.ok) {
    const t = await tokenRes.text();
    throw new Error(`iiko access_token: HTTP ${tokenRes.status} ${t}`);
  }
  const tokenJson = (await tokenRes.json()) as { token?: string };
  if (!tokenJson.token) {
    throw new Error("iiko: в ответе access_token нет поля token");
  }
  return tokenJson.token;
}

/** Если IIKO_ORGANIZATION_ID не задан — первая организация из аккаунта (как на сайте MODX). */
async function iikoResolveOrganizationId(base: string, token: string): Promise<string> {
  const orgRes = await fetch(`${base}/api/1/organizations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ returnAdditionalInfo: true }),
  });
  if (!orgRes.ok) {
    const t = await orgRes.text();
    throw new Error(`iiko organizations: HTTP ${orgRes.status} ${t}`);
  }
  const data = (await orgRes.json()) as {
    organizations?: Array<{ id?: string; organizationId?: string }>;
  };
  const list = data.organizations ?? [];
  const id = String(list[0]?.id ?? list[0]?.organizationId ?? "").trim();
  if (!id) {
    throw new Error("iiko: в аккаунте нет организаций или не удалось прочитать id");
  }
  return id;
}

export async function iikoFetchNomenclature(): Promise<IikoNom> {
  const base = (process.env.IIKO_API_BASE ?? "https://api-ru.iiko.services").replace(/\/$/, "");
  const login = process.env.IIKO_API_LOGIN ?? "";
  if (!login) {
    throw new Error("Задайте IIKO_API_LOGIN в .env проекта menu-crm");
  }

  const token = await iikoAccessToken(base, login);
  let orgId = (process.env.IIKO_ORGANIZATION_ID ?? "").trim();
  if (!orgId) {
    orgId = await iikoResolveOrganizationId(base, token);
  }

  const nomRes = await fetch(`${base}/api/1/nomenclature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizationId: orgId, startRevision: 0 }),
  });
  if (!nomRes.ok) {
    const t = await nomRes.text();
    throw new Error(`iiko nomenclature: HTTP ${nomRes.status} ${t}`);
  }
  return (await nomRes.json()) as IikoNom;
}
