export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-card">
        <h1 className="text-2xl font-semibold text-ink">Вход в меню CRM</h1>
        <p className="mt-2 text-sm text-muted">Пароль задаётся в переменной ADMIN_PASSWORD (.env)</p>
        <form action="/api/auth/login" method="post" className="mt-6 space-y-4">
          {sp.e ? <p className="text-sm text-accent">Неверный пароль</p> : null}
          <label className="block text-sm font-medium text-ink">
            Пароль
            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-ink outline-none ring-accent focus:ring-2"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
