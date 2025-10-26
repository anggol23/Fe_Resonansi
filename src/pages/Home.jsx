import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Carousel } from "flowbite-react";
import { Helmet } from "react-helmet";

import CallToAction from "../components/CallToAction";
import BreakingNewsTicker from "../components/BreakingNewsTicker";

// Gambar Slider
import slide1 from "../assets/slide_photo/IBH.jpg";
import slide2 from "../assets/slide_photo/Merdeka.jpg";
import slide3 from "../assets/slide_photo/PanggungharjoGor.jpg";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/posts/getposts`);
        if (!res.ok) throw new Error("Gagal mengambil data artikel");

        const data = await res.json();
        if (!Array.isArray(data.posts)) {
          throw new Error(`Response bukan array: ${JSON.stringify(data)}`);
        }

        setPosts(data.posts);
      } catch (err) {
        console.error("❌ Error fetching posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [API_URL]);

  const featured = useMemo(() => (posts?.[0] ? posts[0] : null), [posts]);
  const secondary = useMemo(() => posts?.slice(1, 5) || [], [posts]);
  const popular = useMemo(() => posts?.slice(0, 5) || [], [posts]);
  const latest = useMemo(() => posts?.slice(5, 13) || [], [posts]);
  const byCategory = (cat) => posts.filter((p) => (p.category || "").toLowerCase() === cat).slice(0, 6);
  const breakingItems = useMemo(
    () => posts.slice(0, Math.min(8, posts.length)).map((p) => ({ title: p.title, slug: p.slug })),
    [posts]
  );

  return (
    <>
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>Beranda - | Media Informasi | Portal Berita</title>
        <meta name="description" content="Temukan artikel terkini dan informasi terbaru di Portal Berita ." />
        <meta property="og:title" content="Beranda - Media Informasi | Portal Berita" />
        <meta property="og:description" content="Berita dan informasi terkini ." />
        <meta property="og:image" content="/thumbnail-og.jpg" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* ✅ Struktur Semantik */}
  {/* Ticker Breaking News */}
  <BreakingNewsTicker items={breakingItems} />

  <main className="max-w-7xl mx-auto px-3 py-6 space-y-8">
        {/* Slider Promosi (opsional) */}
        <section aria-label="Slider Promosi" className="block">
          <div className="h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 2xl:h-96 rounded-lg overflow-hidden shadow">
            <Carousel slideInterval={4000} className="w-full h-full">
              <img src={slide1} alt="Kegiatan di Balai Desa IBH" className="w-full h-full object-cover" loading="lazy" />
              <img src={slide2} alt="Warga memperingati Hari Kemerdekaan" className="w-full h-full object-cover" loading="lazy" />
              <img src={slide3} alt="Gelanggang Olahraga Desa Panggungharjo" className="w-full h-full object-cover" loading="lazy" />
            </Carousel>
          </div>
        </section>

        {/* Call To Action di bawah slider */}
        <section aria-label="Call To Action" className="mt-6">
          <CallToAction />
        </section>

  {/* Grid Utama ala Suara Merdeka: Hero kiri + daftar headline kanan */}
  <section aria-label="Sorotan & Headline">
          {loading && (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-accent-700"></div>
            </div>
          )}
          {error && <p className="text-center text-red-500">Error: {error}</p>}

          {!loading && !error && posts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Kolom kiri: feature besar + tag chips */}
              <div className="lg:col-span-8 space-y-6">
                {/* Featured */}
                {featured && (
                  <article className="relative overflow-hidden rounded-lg shadow border">
                    <Link to={`/post/${featured.slug}`}>
                      <img src={featured.image} alt={featured.title} className="w-full aspect-video object-cover" loading="lazy" />
                    </Link>
                    <div className="p-4">
                      <Link to={`/post/${featured.slug}`} className="text-accent-700 font-semibold uppercase text-xs tracking-wide">
                        {featured.category}
                      </Link>
                      <h2 className="mt-2 text-3xl font-bold leading-snug headline">
                        <Link to={`/post/${featured.slug}`} className="hover:underline">
                          {featured.title}
                        </Link>
                      </h2>
                    </div>
                  </article>
                )}

                {/* Tagar populer (chips) */}
                {posts.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[...new Set(posts.map((p) => (p.category || '').toLowerCase()))].slice(0, 8).map((tag) => (
                      <Link key={tag} to={`/artikel?cat=${encodeURIComponent(tag)}`} className="px-3 py-1 rounded-full border text-xs hover:bg-accent-50 hover:border-accent-200">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Terbaru list */}
                {latest.length > 0 && (
                  <section aria-label="Terbaru" className="mt-2">
                    <h3 className="text-lg font-bold border-b pb-2">Terbaru</h3>
                    <ul className="divide-y">
                      {latest.map((p) => (
                        <li key={p._id} className="py-3">
                          <Link to={`/post/${p.slug}`} className="hover:underline font-medium">
                            {p.title}
                          </Link>
                          <div className="text-xs text-gray-500">{p.category}</div>
                        </li>
                      ))}
                    </ul>
                    <div className="text-right mt-2">
                      <Link to="/artikel" className="text-accent-700 hover:underline">Lihat semua »</Link>
                    </div>
                  </section>
                )}
              </div>

              {/* Kolom kanan: daftar headline bertumpuk + Terpopuler */}
              <aside className="lg:col-span-4 space-y-6">
                {secondary.length > 0 && (
                  <div className="space-y-4">
                    {secondary.map((p) => (
                      <article key={p._id} className="flex gap-3 border-b pb-3">
                        <Link to={`/post/${p.slug}`} className="shrink-0 w-28 h-20 overflow-hidden rounded">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                        </Link>
                        <div className="min-w-0">
                          <Link to={`/post/${p.slug}`} className="text-accent-700 font-semibold uppercase text-[11px] tracking-wide">
                            {p.category}
                          </Link>
                          <h3 className="mt-1 font-semibold leading-snug line-clamp-2">
                            <Link to={`/post/${p.slug}`} className="hover:underline">
                              {p.title}
                            </Link>
                          </h3>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                {/* Terpopuler */}
                {popular.length > 0 && (
                  <section aria-label="Terpopuler" className="border rounded-lg">
                    <h3 className="px-4 py-3 font-bold bg-gray-50 border-b">Terpopuler</h3>
                    <ul className="px-4 py-2 space-y-3">
                      {popular.map((p, i) => (
                        <li key={p._id} className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-700 text-white text-xs font-bold">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <Link to={`/post/${p.slug}`} className="hover:underline leading-snug">
                            {p.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* CTA dipindah ke bawah slider */}
              </aside>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <p className="text-center text-gray-500">Tidak ada artikel tersedia.</p>
          )}
        </section>

        {/* Section kategori (contoh 2 rubrik) */}
        {!loading && !error && posts.length > 0 && (
          <section className="space-y-10">
            {[{title: 'Jateng', key: 'jateng'}, {title: 'Nasional', key: 'nasional'}].map(({title, key}) => {
              const list = byCategory(key);
              if (list.length === 0) return null;
              return (
                <div key={key}>
                  <h3 className="text-xl font-bold border-b-2 border-accent-700 pb-2 uppercase">{title}</h3>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((p) => (
                      <article key={p._id} className="border rounded-lg overflow-hidden hover:shadow">
                        <Link to={`/post/${p.slug}`}>
                          <img src={p.image} alt={p.title} className="w-full aspect-[16/10] object-cover" loading="lazy" />
                        </Link>
                        <div className="p-3">
                          <Link to={`/post/${p.slug}`} className="text-accent-700 font-semibold uppercase text-[11px] tracking-wide">
                            {p.category}
                          </Link>
                          <h4 className="mt-1 font-semibold leading-snug line-clamp-2">
                            <Link to={`/post/${p.slug}`} className="hover:underline">{p.title}</Link>
                          </h4>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
}
