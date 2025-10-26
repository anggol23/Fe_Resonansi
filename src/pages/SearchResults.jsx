import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { TextInput, Button } from "flowbite-react";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const q = (searchParams.get("q") || "").trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const next = (formData.get("q") || "").toString().trim();
    setSearchParams(next ? { q: next } : {});
  };

  useEffect(() => {
    let stop = false;
    const fetchResults = async () => {
      if (!q) {
        setResults([]);
        setError("");
        return;
      }
      setLoading(true);
      setError("");
      try {
        // Coba minta ke backend jika mendukung pencarian server-side
        const url = `${API_URL}/api/posts/getposts?searchTerm=${encodeURIComponent(q)}`;
        const res = await fetch(url);
        const text = await res.text();
        let data = {};
        try {
          data = JSON.parse(text);
        } catch (_) {
          // Jika bukan JSON valid, fallback ke client-side filter
          data = {};
        }
        if (res.ok && Array.isArray(data.posts)) {
          if (!stop) setResults(data.posts);
        } else {
          // Fallback: ambil semua lalu filter di klien
          const resAll = await fetch(`${API_URL}/api/posts/getposts`);
          const dataAll = await resAll.json();
          const list = Array.isArray(dataAll.posts) ? dataAll.posts : [];
          const lower = q.toLowerCase();
          const filtered = list.filter((p) =>
            [p.title, p.description, p.excerpt, p.content]
              .filter(Boolean)
              .some((t) => t.toLowerCase().includes(lower))
          );
          if (!stop) setResults(filtered);
        }
      } catch (err) {
        setError(err.message || "Gagal memuat hasil pencarian");
      } finally {
        if (!stop) setLoading(false);
      }
    };
    fetchResults();
    return () => {
      stop = true;
    };
  }, [q, API_URL]);

  const prettyDate = useMemo(() => (d) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch (_) {
      return "";
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-3 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Pencarian</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <TextInput name="q" placeholder="Cari judul atau isi artikel..." defaultValue={q} className="flex-1" />
        <Button type="submit" color="failure" outline>
          Cari
        </Button>
      </form>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-accent-700"></div>
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && q && results.length === 0 && (
        <p className="text-gray-500">Tidak ada hasil untuk "{q}".</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((p) => (
          <article key={p._id} className="border rounded-lg overflow-hidden hover:shadow">
            <Link to={`/post/${p.slug}`}>
              <img src={p.image} alt={p.title} className="w-full aspect-[16/10] object-cover" loading="lazy" />
            </Link>
            <div className="p-3">
              <Link to={`/post/${p.slug}`} className="text-accent-700 font-semibold uppercase text-[11px] tracking-wide">
                {p.category}
              </Link>
              <h3 className="mt-1 font-semibold leading-snug line-clamp-2">
                <Link to={`/post/${p.slug}`} className="hover:underline">
                  {p.title}
                </Link>
              </h3>
              <div className="text-xs text-gray-500">{prettyDate(p.createdAt)}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";

// function SearchResults() {
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const searchTerm = searchParams.get("searchTerm");
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (searchTerm) {
//         setLoading(true);
//         setError(null);
//         try {
//           // Ganti URL API sesuai dengan backend Anda
//           const response = await fetch(`/api/search?query=${searchTerm}`);
//           if (!response.ok) {
//             throw new Error("Gagal mengambil hasil pencarian.");
//           }
//           const data = await response.json();
//           setSearchResults(data);
//         } catch (err) {
//           setError(err.message);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();
//   }, [searchTerm]);

//   // Tampilkan pesan loading jika sedang memuat data
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-lg">Memuat hasil pencarian...</p>
//       </div>
//     );
//   }

//   // Tampilkan pesan error jika terjadi kesalahan
//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-red-500">Terjadi kesalahan: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Hasil Pencarian</h1>
//       {searchTerm ? (
//         searchResults.length > 0 ? (
//           <ul className="space-y-4">
//             {searchResults.map((result) => (
//               <li key={result._id} className="border p-4 rounded-md shadow-sm">
//                 <h2 className="text-xl font-semibold">{result.title}</h2>
//                 <p className="text-gray-600">{result.description}</p>
//                 {/* Tambahkan elemen lain sesuai kebutuhan */}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-600">
//             Tidak ada hasil yang ditemukan untuk "{searchTerm}".
//           </p>
//         )
//       ) : (
//         <p className="text-gray-600">
//           Masukkan istilah pencarian untuk melihat hasil.
//         </p>
//       )}
//     </div>
//   );
// }

// export default SearchResults;