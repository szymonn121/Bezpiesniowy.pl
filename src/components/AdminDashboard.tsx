"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type AdminSong = {
  id: number;
  title: string;
  artist: string;
  album: string | null;
  year: number | null;
  genre: string | null;
  fileName: string;
  durationSeconds: number | null;
};

export function AdminDashboard() {
  const [songs, setSongs] = useState<AdminSong[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Controlled form fields so we can prefill from filename
  const [titleInput, setTitleInput] = useState<string>("");
  const [artistInput, setArtistInput] = useState<string>("");
  const [albumInput, setAlbumInput] = useState<string | null>(null);
  const [yearInput, setYearInput] = useState<number | null>(null);
  const [genreSelect, setGenreSelect] = useState<string>("");
  const [genreOther, setGenreOther] = useState<string>("");
  const fileInputRef = useState<HTMLInputElement | null>(null)[0];

  const loadSongs = useCallback(async () => {
    setLoadingSongs(true);
    setError(null);
    try {
      const response = await fetch("/api/songs");
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message ?? "Nie udało się pobrać listy utworów");
      }
      setSongs(data.songs ?? []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Wystąpił błąd");
    } finally {
      setLoadingSongs(false);
    }
  }, []);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  const handleUpload = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setSuccessMessage(null);
      setUploading(true);

      const form = event.currentTarget;
      const formData = new FormData();
      const fileEl = (document.getElementById("upload-file") as HTMLInputElement | null);
      const file = fileEl?.files?.[0] ?? null;
      if (!file) {
        setError("Plik MP3 jest wymagany");
        setUploading(false);
        return;
      }
      formData.append("file", file);
      formData.append("title", titleInput);
      formData.append("artist", artistInput);
      if (albumInput) formData.append("album", albumInput);
      if (yearInput) formData.append("year", String(yearInput));
      const genre = genreSelect === "Other" ? genreOther : genreSelect;
      if (genre) formData.append("genre", genre);

      try {
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message ?? "Nie udało się wgrać pliku");
        }

        setSuccessMessage(`Dodano: ${data.song.artist} – ${data.song.title}`);
        form.reset();
        // reload the page to ensure static assets (public/audio) are available
        window.location.reload();
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Wystąpił błąd podczas wgrywania");
      } finally {
        setUploading(false);
      }
    },
    [loadSongs],
  );

  const songCount = songs.length;

  const totalDuration = useMemo(() => {
    const totalSeconds = songs.reduce((sum, song) => sum + (song.durationSeconds ?? 0), 0);
    if (totalSeconds <= 0) {
      return "brak danych";
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);
    return `${minutes} min ${seconds} s`;
  }, [songs]);

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-6 shadow-xl backdrop-blur">
        <header className="grid gap-2">
          <h1 className="text-3xl font-semibold text-white">Panel administracyjny</h1>
          <p className="text-sm text-slate-300">
            Wgrywaj pliki MP3 z lokalnej dysku. Metadane ID3 są odczytywane automatycznie, ale możesz je
            nadpisać ręcznie.
          </p>
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
            Upewnij się, że posiadasz prawa do dystrybucji muzyki. Aplikacja nie hostuje plików w chmurze
            – pliki są przechowywane lokalnie w katalogu <code className="text-amber-100">/public/audio</code>.
          </p>
        </header>

        <form onSubmit={handleUpload} className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-6">
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
              <label className="grid gap-2 text-sm text-slate-200">
                <span>Tytuł</span>
                <input
                  name="title"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="np. Cieszę się, że jestem z tobą"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-200">
                <span>Wykonawca</span>
                <input
                  name="artist"
                  value={artistInput}
                  onChange={(e) => setArtistInput(e.target.value)}
                  placeholder="np. Krzysztof Krawczyk"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </label>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
              <label className="grid gap-2 text-sm text-slate-200">
                <span>Album</span>
                <input
                  name="album"
                  value={albumInput ?? ""}
                  onChange={(e) => setAlbumInput(e.target.value || null)}
                  placeholder="Album (opcjonalnie)"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-200">
                <span>Rok</span>
                <input
                  name="year"
                  type="number"
                  value={yearInput ?? ""}
                  onChange={(e) => setYearInput(e.target.value ? Number(e.target.value) : null)}
                  placeholder="1983"
                  min={1900}
                  max={2100}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-200">
                <span>Gatunek</span>
                <div className="flex gap-2">
                  <select
                    name="genreSelect"
                    value={genreSelect}
                    onChange={(e) => setGenreSelect(e.target.value)}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="">Wybierz gatunek</option>
                    <option value="Pop">Pop</option>
                    <option value="Rock">Rock</option>
                    <option value="Hip-Hop">Hip-Hop</option>
                    <option value="Disco - polo">Disco - polo</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Folk">Folk</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Other">Inny...</option>
                  </select>
                  {genreSelect === "Other" && (
                    <input
                      name="genre"
                      value={genreOther}
                      onChange={(e) => setGenreOther(e.target.value)}
                      placeholder="Wpisz gatunek"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                    />
                  )}
                </div>
              </label>
            </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200">
              Plik MP3 <span className="text-emerald-400">*</span>
            </label>
            <input
              ref={(el) => (fileInputRef as any) || null}
              id="upload-file"
              type="file"
              name="file"
              accept=".mp3,audio/mpeg"
              required
              onChange={async (e) => {
                const file = e.currentTarget.files?.[0];
                if (!file) return;

                // Try server-side parsing first
                try {
                  const fd = new FormData();
                  fd.append("file", file);
                  const res = await fetch("/api/admin/parse-metadata", { method: "POST", body: fd });
                  if (res.ok) {
                    const data = await res.json().catch(() => ({}));
                    const metaTitle = data.title ?? "";
                    const metaArtist = data.artist ?? "";
                    const metaAlbum = data.album ?? "";
                    if (metaArtist && !artistInput) setArtistInput(metaArtist);
                    if (metaTitle && !titleInput) setTitleInput(metaTitle);
                    if (metaAlbum && !albumInput) setAlbumInput(metaAlbum);
                    if (metaArtist || metaTitle || metaAlbum) return;
                  }
                } catch (err) {
                  console.warn("parse-metadata API failed", err);
                }

                // Fallback to filename parsing
                const name = file.name.replace(/\.[^.]+$/, "");
                const cleaned = name.replace(/_/g, " ");
                const parts = cleaned.split(/ - | – | — |\|/).map((s) => s.trim());
                if (parts.length >= 2) {
                  if (!artistInput) setArtistInput(parts[0]);
                  if (!titleInput) setTitleInput(parts.slice(1).join(" - "));
                } else {
                  const featMatch = cleaned.match(/(.+?)\s+ft\.?\s+(.+)/i) || cleaned.match(/(.+?)\s+feat\.?\s+(.+)/i);
                  if (featMatch) {
                    if (!artistInput) setArtistInput(featMatch[1].trim());
                    if (!titleInput) setTitleInput(featMatch[2].trim());
                  }
                }
              }}
              className="w-full rounded-xl border border-dashed border-emerald-500/40 bg-slate-900 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-500/20 file:px-4 file:py-2 file:text-emerald-200"
            />
          </div>
          <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600 disabled:opacity-60"
            >
              {uploading ? "Wgrywanie..." : "Dodaj utwór"}
            </button>
          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
              {successMessage}
            </p>
          )}
        </form>
      </section>

      <section className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-6 shadow-xl backdrop-blur">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white">Biblioteka utworów</h2>
            <p className="text-sm text-slate-300">Łącznie {songCount} utworów · {totalDuration}</p>
          </div>
          <button
            type="button"
            onClick={loadSongs}
            disabled={loadingSongs}
            className="rounded-full border border-slate-400 px-4 py-1.5 text-sm text-slate-200 transition hover:bg-slate-800 disabled:opacity-60"
          >
            Odśwież listę
          </button>
        </header>

        {loadingSongs ? (
          <p className="text-sm text-slate-300">Ładowanie listy utworów...</p>
        ) : songs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-600 px-4 py-3 text-sm text-slate-300">
            Nie dodano jeszcze żadnych utworów.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-slate-900/60 text-left uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Tytuł</th>
                  <th className="px-4 py-3">Wykonawca</th>
                  <th className="px-4 py-3">Album</th>
                  <th className="px-4 py-3">Rok</th>
                  <th className="px-4 py-3">Gatunek</th>
                  <th className="px-4 py-3">Długość</th>
                  <th className="px-4 py-3">Plik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-900/20 text-slate-200">
                {songs.map((song) => (
                  <tr key={song.id} className="hover:bg-slate-900/40">
                    <td className="px-4 py-3 font-medium text-white">{song.title}</td>
                    <td className="px-4 py-3">{song.artist}</td>
                    <td className="px-4 py-3">{song.album ?? "—"}</td>
                    <td className="px-4 py-3">{song.year ?? "—"}</td>
                    <td className="px-4 py-3">{song.genre ?? "—"}</td>
                    <td className="px-4 py-3">
                      {song.durationSeconds ? `${(song.durationSeconds / 60).toFixed(1)} min` : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{song.fileName}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={async () => {
                          const ok = confirm(`Usunąć utwór: ${song.artist} — ${song.title}?`);
                          if (!ok) return;
                          try {
                            const res = await fetch("/api/songs", {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: song.id }),
                            });
                            const data = await res.json().catch(() => ({}));
                            if (!res.ok) throw new Error(data.message || "Błąd usuwania");
                            setSongs((prev) => prev.filter((s) => s.id !== song.id));
                          } catch (err) {
                            console.error(err);
                            setError(err instanceof Error ? err.message : "Wystąpił błąd");
                          }
                        }}
                        className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-red-700"
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
};

function FormField({ label, name, placeholder, type = "text", min, max }: FormFieldProps) {
  return (
    <label className="grid gap-2 text-sm text-slate-200">
      <span>{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </label>
  );
}

