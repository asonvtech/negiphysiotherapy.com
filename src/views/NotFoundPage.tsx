import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-5xl font-black text-[--theme-blue]">404</h1>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Page not found</h2>
        <p className="mt-3 text-slate-600">The page you requested does not exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-[--theme-blue] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#094574]"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
}
