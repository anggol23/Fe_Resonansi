import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const categories = ["semua", "pendidikan", "sosial", "ekonomi", "politik", "cerpen", "puisi"];

export default function Artikel() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/api/posts/getposts`;
        if (selectedCategory !== "semua") {
          url += `?category=${selectedCategory}`;
        }

        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error(`Gagal fetch: ${res.statusText}`);

        const data = await res.json();
        if (!Array.isArray(data.posts)) {
          throw new Error(`Response bukan array: ${JSON.stringify(data)}`);
        }

        setPosts(data.posts);
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err.message);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    return () => controller.abort();
  }, [API_URL, selectedCategory]);

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold text-center my-7">Artikel</h1>
      <div className="w-20 h-1 bg-red-600 mx-auto my-7"></div>

      {/* 🔘 Tombol Filter Kategori */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${
              selectedCategory === cat
                ? "bg-red-600 text-white"
                : "bg-white text-red-600 border-red-600"
            } hover:bg-red-500 hover:text-white transition`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* 🔄 Loading */}
      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600"></div>
        </div>
      )}

      {/* ❌ Error */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 📰 Artikel */}
      {!loading && posts.length === 0 ? (
        <p className="text-center text-gray-500">Tidak ada artikel tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border rounded-lg shadow-lg p-4 transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={post.image || "/default-image.jpg"}
                alt={post.title || "Artikel tanpa judul"}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-500">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : "Tanggal tidak tersedia"}
              </p>
              <Link
                to={`/post/${post.slug}`}
                className="text-red-500 font-semibold mt-3 block hover:underline"
              >
                Baca Selengkapnya →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
