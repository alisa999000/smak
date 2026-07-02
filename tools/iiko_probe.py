# -*- coding: utf-8 -*-
"""Одноразовая проверка iiko Cloud API (ключ только из переменной окружения IIKO_API_LOGIN)."""
import json
import os
import sys
import urllib.error
import urllib.request

BASE = os.environ.get("IIKO_API_BASE", "https://api-ru.iiko.services").rstrip("/")
KEY = os.environ.get("IIKO_API_LOGIN", "").strip()
if not KEY:
    print("Задайте IIKO_API_LOGIN в окружении", file=sys.stderr)
    sys.exit(2)


def post(path: str, body: dict, token: str | None = None) -> tuple[int, dict | list | str]:
    url = f"{BASE}{path}"
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json; charset=utf-8")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            code = resp.getcode()
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        return e.code, raw
    try:
        return code, json.loads(raw)
    except json.JSONDecodeError:
        return code, raw[:500]


def main() -> None:
    code, tok_body = post("/api/1/access_token", {"apiLogin": KEY})
    print("access_token:", code)
    if code != 200:
        print(tok_body)
        sys.exit(1)
    assert isinstance(tok_body, dict)
    token = tok_body.get("token")
    if not token:
        print("Нет token в ответе:", tok_body)
        sys.exit(1)
    print("  token_len:", len(token))

    code, org_body = post(
        "/api/1/organizations",
        {"returnAdditionalInfo": True},
        token=token,
    )
    print("organizations:", code)
    if code != 200:
        print(org_body)
        sys.exit(1)
    orgs = org_body.get("organizations", []) if isinstance(org_body, dict) else []
    print("  count:", len(orgs))
    org_id = None
    for o in orgs[:3]:
        oid = o.get("id")
        name = o.get("name", "")
        print("  -", oid, "|", name)
        if isinstance(o, dict):
            extra = {k: o.get(k) for k in ("restaurantAddress", "latitude", "longitude", "country", "currencyIsoName", "organizationType", "rmsGroup", "rmsType") if k in o}
            if extra:
                print("     extra:", extra)
        if org_id is None:
            org_id = oid
    if not org_id:
        print("Нет организаций")
        sys.exit(1)

    code, nom = post(
        "/api/1/nomenclature",
        {"organizationId": str(org_id), "startRevision": 0},
        token=token,
    )
    print("nomenclature (with startRevision:0):", code)
    if code != 200:
        print(str(nom)[:800])
        sys.exit(1)
    assert isinstance(nom, dict)
    print("  top_keys:", sorted(nom.keys())[:25])
    print("  groups:", len(nom.get("groups", [])))
    print("  products:", len(nom.get("products", [])))
    print("  revision:", nom.get("revision"))

    code0b, nom2 = post(
        "/api/1/nomenclature",
        {"organizationId": str(org_id)},
        token=token,
    )
    print("nomenclature (only organizationId):", code0b)
    if isinstance(nom2, dict):
        print("  groups:", len(nom2.get("groups", [])), "products:", len(nom2.get("products", [])))

    # Внешнее меню (если доступно)
    code2, menu2 = post("/api/2/menu", {"organizationId": str(org_id)}, token=token)
    print("menu v2:", code2, type(menu2).__name__)
    if isinstance(menu2, dict):
        print("  keys:", list(menu2.keys())[:12])
        pc = menu2.get("priceCategories") or []
        print("  priceCategories len:", len(pc) if isinstance(pc, list) else "?")

    # Типы доставки / заказов
    code3, ot = post(
        "/api/1/deliveries/order_types",
        {"organizationIds": [str(org_id)]},
        token=token,
    )
    print("deliveries/order_types:", code3)
    if isinstance(ot, dict):
        print("  keys:", list(ot.keys())[:12])
        ots = ot.get("orderTypes") or ot.get("order_types") or []
        if isinstance(ots, list):
            print("  orderTypes count:", len(ots))
            for x in ots[:2]:
                if isinstance(x, dict):
                    print("   sample:", {k: x.get(k) for k in list(x)[:6]})

    em = menu2.get("externalMenus", []) if isinstance(menu2, dict) else []
    print("externalMenus count:", len(em) if isinstance(em, list) else "n/a")
    ext_id = None
    if isinstance(em, list) and em:
        m0 = em[0]
        if isinstance(m0, dict):
            ext_id = m0.get("id")
            print("  first menu id:", ext_id, "name:", m0.get("name"))
    if ext_id:
        code5, byid = post(
            "/api/2/menu/by_id",
            {"organizationId": str(org_id), "externalMenuId": str(ext_id)},
            token=token,
        )
        print("menu/by_id:", code5)
        if isinstance(byid, dict):
            print("  keys:", list(byid.keys())[:15])
            ic = byid.get("itemCategories") or []
            print("  itemCategories:", len(ic) if isinstance(ic, list) else ic)

    code_tg, tg = post(
        "/api/1/terminal_groups",
        {"organizationIds": [str(org_id)]},
        token=token,
    )
    print("terminal_groups:", code_tg)
    if isinstance(tg, dict):
        print("  keys:", list(tg.keys())[:10])
        tgs = tg.get("terminalGroups") or []
        print("  terminalGroups len:", len(tgs) if isinstance(tgs, list) else "?")
        if isinstance(tgs, list) and tgs:
            g0 = tgs[0]
            if isinstance(g0, dict):
                print("  first keys:", list(g0.keys())[:8])
                print("  first terminalGroup id:", g0.get("id"), "name:", g0.get("name"))

    code_sl, sl = post(
        "/api/1/stop_lists",
        {"organizationIds": [str(org_id)]},
        token=token,
    )
    print("stop_lists:", code_sl)
    if isinstance(sl, dict):
        print("  keys:", list(sl.keys())[:10])

    code_pt, pt = post(
        "/api/1/payment_types",
        {"organizationIds": [str(org_id)]},
        token=token,
    )
    print("payment_types:", code_pt)
    if isinstance(pt, dict):
        print("  keys:", list(pt.keys())[:10])

    # Пробный вызов create без реальных данных — ожидаем 4xx с описанием полей
    code4, cr = post(
        "/api/1/deliveries/create",
        {"organizationId": str(org_id)},
        token=token,
    )
    print("deliveries/create (пустое тело):", code4)
    if isinstance(cr, dict):
        print("  correlationId:", cr.get("correlationId"))
        print("  errorDescription:", cr.get("errorDescription", cr.get("message", str(cr)[:300])))
    else:
        print(" ", str(cr)[:400])


if __name__ == "__main__":
    main()
