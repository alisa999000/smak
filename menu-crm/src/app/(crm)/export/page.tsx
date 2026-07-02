export default function ExportPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-ink">Выгрузка и API</h1>
        <p className="mt-2 text-sm text-muted">
          Передавайте заголовок <code className="rounded bg-bg px-1">X-Api-Key</code> со значением переменной{" "}
          <code className="rounded bg-bg px-1">PUBLIC_API_KEY</code> из файла <code className="rounded bg-bg px-1">.env</code>.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Все позиции</h2>
        <pre className="overflow-x-auto rounded-xl bg-bg p-4 text-xs text-ink">
{`GET /api/v1/products
X-Api-Key: <PUBLIC_API_KEY>`}
        </pre>
      </div>

      <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Меню недели (понедельник недели)</h2>
        <p className="text-sm text-muted">
          Параметр <code className="rounded bg-bg px-1">weekStart</code> — дата понедельника в формате{" "}
          <code className="rounded bg-bg px-1">YYYY-MM-DD</code>. Если не указан, берётся текущая неделя. В ответ входят
          позиции недели и блюда с флагом «каждый день» (кроме снятых с конкретного дня в CRM).
        </p>
        <pre className="overflow-x-auto rounded-xl bg-bg p-4 text-xs text-ink">
{`GET /api/v1/menu/week?weekStart=2026-05-05
X-Api-Key: <PUBLIC_API_KEY>`}
        </pre>
      </div>

      <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Копировать неделю (только CRM, кука входа)</h2>
        <p className="text-sm text-muted">
          Тело JSON: <code className="rounded bg-bg px-1">fromWeekStart</code>, <code className="rounded bg-bg px-1">toWeekStart</code> — даты
          понедельников <code className="rounded bg-bg px-1">YYYY-MM-DD</code>. Неделя <code className="rounded bg-bg px-1">toWeekStart</code> перед
          копированием очищается.
        </p>
        <pre className="overflow-x-auto rounded-xl bg-bg p-4 text-xs text-ink">
{`POST /api/admin/weekly/copy
Content-Type: application/json
Cookie: menu_crm_auth=…

{ "fromWeekStart": "2026-05-05", "toWeekStart": "2026-05-12" }`}
        </pre>
      </div>

      <div className="rounded-2xl border border-line bg-chip p-6 text-sm text-ink">
        <p className="font-medium">Интеграции</p>
        <p className="mt-2 text-muted">
          Форматы iiko и Яндекса отличаются по полям и идентификаторам. Следующий шаг — отдельные мапперы{" "}
          <code className="mx-1 rounded bg-surface px-1">/api/v1/export/iiko</code> и{" "}
          <code className="rounded bg-surface px-1">/api/v1/export/yandex</code> под ваши реальные схемы приёма.
        </p>
      </div>
    </div>
  );
}
