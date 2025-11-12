<p align="center">
  <img src="public/file.svg" width="96" alt="Bezpieśniowy icon" />
</p>

# Bezpieśniowy 🎧

Bezpieśniowy to MVP quizu muzycznego, w którym zgadujesz polskie piosenki po coraz dłuższych fragmentach audio (0.5s → 1s → 2s → 5s → 10s). Aplikacja działa lokalnie, odczytuje metadane ID3 z Twoich plików MP3, udostępnia panel administracyjny, JWT auth oraz testy jednostkowe.

> ⚠️ **Pamiętaj o prawach autorskich** – korzystaj wyłącznie z plików, do których posiadasz prawa lub licencję. Projekt ma charakter edukacyjny i do użytku prywatnego.

## Funkcje

- 🔊 Quiz z progresywnymi fragmentami audio i systemem punktowym  
- 📎 Wskazówki odsłaniane wraz z kolejnymi próbkami  
- 🛠️ Panel admina do wgrywania lokalnych plików MP3 + odczyt ID3  
- 🔐 JWT auth (konto admina dzięki seedowi Prisma)  
- 🗄️ Baza SQLite zarządzana przez Prisma  
- 🎨 Nowoczesny, responsywny interfejs (Tailwind CSS)  
- ✅ Testy jednostkowe (Jest + Testing Library)  
- 📄 Kompletny README + instrukcja deploymentu

## Stos technologiczny

- [Next.js 16](https://nextjs.org/) (App Router, React 19)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Tailwind CSS v4 (preview)](https://tailwindcss.com/)  
- [Prisma ORM](https://www.prisma.io/) + SQLite  
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)  
- [music-metadata](https://github.com/Borewit/music-metadata) do odczytu ID3  
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

## Wymagania wstępne

- Node.js 18.18+ (zalecany LTS)  
- npm 9+  
- Lokalna kolekcja plików MP3

## Konfiguracja

1. **Klonowanie repozytorium**

   ```bash
   git clone <url>
   cd bezpiesniowy
   ```

2. **Instalacja zależności**

   ```bash
   npm install
   ```

3. **Zmienne środowiskowe**

   Skopiuj plik `.env.example` do `.env` i uzupełnij wartości.

   ```bash
   cp .env.example .env
   ```

   Kluczowe wartości:

   - `DATABASE_URL` – ścieżka do bazy SQLite (`file:./dev.db`)  
   - `JWT_SECRET` – silny sekret dla tokenów  
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` – dane konta admina seedowanego do bazy

4. **Migracje + seed**

   ```bash
   npm run prisma:migrate --name init
   npm run prisma:seed
   ```

5. **Uruchomienie w trybie deweloperskim**

   ```bash
   npm run dev
   ```

   Aplikacja pojawi się pod adresem [http://localhost:3000](http://localhost:3000).

## Panel administracyjny

- Zaloguj się na `/login` używając danych z `.env`.  
- Przechodząc na `/admin` możesz:
  - Wgrywać pliki MP3 (zapisywane w `public/audio`)  
  - Nadpisywać metadane lub korzystać z odczytanych ID3  
  - Przeglądać bibliotekę utworów  
- Fragmenty audio są odtwarzane bezpośrednio z katalogu `public/audio`.

## Testy

```bash
npm test
```

Testy obejmują m.in. logikę gry (`normalizeAnswer`, punktacja).  
Możesz uruchomić tryb watch: `npm run test:watch`.

## Budowanie i uruchomienie produkcyjne

```bash
npm run build
npm start
```

Serwer domyślnie działa w trybie Node.js. Pliki MP3 muszą być dostępne lokalnie na serwerze.

## Hosting / Deployment

1. **Vercel / Netlify / inny hosting statyczny**  
   - Projekt wymaga Node.js (API routes) oraz lokalnego systemu plików.  
   - Do hostingu w chmurze zaleca się kontenery (Docker) lub serwer VPS z dostępem do dysku.

2. **Deployment na VPS / serwerze dedykowanym**

   ```bash
   npm install --production
   npm run build
   npm run prisma:migrate
   npm run prisma:seed # opcjonalnie, tylko raz
   npm start
   ```

   Skopiuj lokalne MP3 do katalogu `public/audio` na serwerze. Dbaj o kopie zapasowe bazy (`prisma/dev.db`).

3. **Docker (sugestia)**

   Utwórz obraz Node.js, zainstaluj zależności, skopiuj projekt + pliki audio, wykonaj migrate/seed, expose port 3000.

## Bezpieczeństwo i prywatność

- Hasła użytkowników są hashowane (`bcryptjs`).  
- Tokeny JWT są trzymane w ciasteczku HttpOnly.  
- Pliki MP3 nie opuszczają Twojej infrastruktury.  
- Zadbaj o HTTPS i silne hasła, jeśli udostępniasz aplikację online.

## Rozwój

Pomysły na kolejne iteracje:

- Analiza wyników i statystyki graczy  
- Obsługa wielu kont użytkowników z rankingiem  
- Pre-generowanie krótkich klipów audio (dla lepszej kontroli)  
- Integracja z zewnętrznymi źródłami metadanych

---

Made with ❤️ for prywatne, edukacyjne zgadywanie polskich hitów. Smacznego słuchania! 🎶
