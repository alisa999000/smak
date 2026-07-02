<template>
  <div>
    <h1>Выгрузка / API</h1>
    <div class="card">
      <h2>Публичные эндпоинты</h2>
      <ul>
        <li><code>GET /api/v1/products</code> — номенклатура (заголовок X-Api-Key)</li>
        <li><code>GET /api/v1/menu/week?weekStart=YYYY-MM-DD</code> — меню на неделю</li>
      </ul>
      <p class="muted">Ключ API задаётся в PUBLIC_API_KEY (.env menu-crm)</p>
    </div>
  </div>
</template>

<style scoped>
.muted { color: var(--muted); }
code { background: var(--chip); padding: 2px 6px; border-radius: 4px; }
</style>
