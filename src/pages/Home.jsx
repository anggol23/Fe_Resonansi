import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Carousel } from "flowbite-react";
import { Helmet } from "react-helmet";

import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

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
      <main className="max-w-7xl mx-auto px-3 py-5 space-y-8">

        {/* Hero Slider */}
        <section aria-label="Slider Promosi">
          <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 rounded-lg overflow-hidden shadow-lg">
            <Carousel slideInterval={3000} className="w-full h-full">
              <img src={slide1} alt="Kegiatan di Balai Desa IBH" className="w-full h-full object-cover" loading="lazy" />
              <img src={slide2} alt="Warga memperingati Hari Kemerdekaan" className="w-full h-full object-cover" loading="lazy" />
              <img src={slide3} alt="Gelanggang Olahraga Desa Panggungharjo" className="w-full h-full object-cover" loading="lazy" />
            </Carousel>
          </div>
        </section>

        {/* Call to Action */}
        <section aria-label="Aksi Ajakan">
          <CallToAction />
        </section>

        {/* Artikel Terkini */}
        <section aria-label="Artikel Terkini">
          <h2 className="text-2xl font-semibold text-center">Artikel Terkini</h2>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-500"></div>
            </div>
          )}

          {/* Error */}
          {error && <p className="text-center text-red-500">Error: {error}</p>}

          {/* Post List */}
          {!loading && !error && posts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post._id} className="h-full flex">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}

          {/* Jika Kosong */}
          {!loading && !error && posts.length === 0 && (
            <p className="text-center text-gray-500">Tidak ada artikel tersedia.</p>
          )}

          {/* Link Semua Artikel */}
          {!loading && !error && posts.length > 0 && (
            <div className="text-center mt-4">
              <Link to="/artikel" className="text-lg text-red-500 hover:underline">
                Lihat Semua Artikel →
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
