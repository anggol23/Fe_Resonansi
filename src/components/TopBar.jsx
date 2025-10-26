import { useEffect, useState } from "react";

// Baris tipis di bagian paling atas seperti portal berita (tanggal/jam & tautan cepat)
export default function TopBar() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const localeDate = now.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full bg-gray-100 text-gray-600 text-xs">
      <div className="mx-auto max-w-7xl px-3 flex items-center justify-between h-8">
        <div className="truncate">
          {localeDate}
        </div>
        <nav className="hidden sm:flex gap-4">
          <a className="hover:text-accent-700 transition-colors" href="#" aria-label="Tautan cepat Live">Live</a>
          <a className="hover:text-accent-700 transition-colors" href="#" aria-label="Tautan cepat Indeks">Indeks</a>
          <a className="hover:text-accent-700 transition-colors" href="#" aria-label="Tautan cepat E-Paper">E-Paper</a>
        </nav>
      </div>
    </div>
  );
}
