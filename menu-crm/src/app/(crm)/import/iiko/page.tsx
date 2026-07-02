import { ImportIikoButton } from "@/components/ImportIikoButton";

export default function ImportIikoPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-ink">Импорт из iiko</h1>
        <p className="mt-2 text-sm text-muted">
          Подтягиваем <strong>номенклатуру</strong> через облачный API: блюда типа Dish/Goods, цены (копейки), вес, описание,
          первая картинка из <code className="rounded bg-bg px-1">imageLinks</code>. Категории в CRM создаются по группам
          iiko (<code className="rounded bg-bg px-1">groupId</code>).
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Переменные в .env</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
          <li>
            <code className="rounded bg-bg px-1">IIKO_API_LOGIN</code> — ключ API из личного кабинета iiko
          </li>
          <li>
            <code className="rounded bg-bg px-1">IIKO_ORGANIZATION_ID</code> — UUID организации
          </li>
          <li>
            <code className="rounded bg-bg px-1">IIKO_API_BASE</code> — по умолчанию{" "}
            <code className="rounded bg-bg px-1">https://api-ru.iiko.services</code>
          </li>
        </ul>
        <p className="mt-4 text-xs text-muted">
          Повторный импорт обновляет те же позиции по <code className="rounded bg-bg px-1">iikoProductId</code> (идемпотентно).
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-chip p-6">
        <ImportIikoButton />
      </div>
    </div>
  );
}
