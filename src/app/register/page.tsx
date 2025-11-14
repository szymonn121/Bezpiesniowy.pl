import Link from "next/link";
import { RegisterForm } from "@/components/RegisterForm";
import { getCurrentUserFromCookies } from "@/lib/server-auth";

export default async function RegisterPage() {
  const user = await getCurrentUserFromCookies();

  if (user) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-white">Jesteś już zalogowany</h1>
        <p className="text-slate-300">Twoje konto ({user.email}) ma status {user.role === "ADMIN" ? "administratora" : "użytkownika"}.</p>
        <div className="flex gap-3">
          <Link href="/" className="rounded-full border border-slate-400 px-6 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900">Przejdź do gry</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid gap-6 text-center">
        <h1 className="text-4xl font-semibold text-white">Rejestracja konta</h1>
        <p className="text-base text-slate-300">Stwórz konto, aby zapisywać wyniki i zarządzać biblioteką (jeśli masz uprawnienia).</p>
      </section>
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl border border-white/6 bg-slate-900/50 p-6 shadow-lg">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
