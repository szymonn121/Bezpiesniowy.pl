import Link from "next/link";
import { AdminDashboard } from "@/components/AdminDashboard";
import { getCurrentUserFromCookies } from "@/lib/server-auth";

export default async function AdminPage() {
  const user = await getCurrentUserFromCookies();

  if (!user) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-white">Panel admina</h1>
        <p className="text-slate-300">Musisz być zalogowany, aby uzyskać dostęp do panelu administracyjnego.</p>
        <Link
          href="/login"
          className="mx-auto inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
        >
          Przejdź do logowania
        </Link>
      </main>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-white">Odmowa dostępu</h1>
        <p className="text-slate-300">
          Twoje konto nie ma uprawnień administratora. Skontaktuj się z osobą zarządzającą aplikacją.
        </p>
        <Link
          href="/"
          className="mx-auto inline-flex items-center justify-center rounded-full border border-slate-400 px-6 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
        >
          Wróć na stronę główną
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <AdminDashboard />
    </main>
  );
}

