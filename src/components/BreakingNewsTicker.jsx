import { Link } from "react-router-dom";

// Komponen ticker sederhana dengan animasi scroll horizontal
export default function BreakingNewsTicker({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full bg-accent-700 text-white">
      <div className="mx-auto max-w-7xl px-3 flex items-center gap-3 h-10 overflow-hidden">
        <span className="text-xs font-semibold uppercase bg-white/20 px-2 py-1 rounded">
          Breaking
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap animate-marquee">
            {items.map((it) => (
              <Link
                key={it.slug}
                to={`/post/${it.slug}`}
                className="text-sm hover:underline"
                title={it.title}
              >
                {it.title}
              </Link>
            ))}
            {/* duplikasi untuk terus bergulir */}
            {items.map((it) => (
              <Link
                key={`dup-${it.slug}`}
                to={`/post/${it.slug}`}
                className="text-sm hover:underline"
                title={it.title}
              >
                {it.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
