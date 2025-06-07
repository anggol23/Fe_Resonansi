import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="group relative w-full border border-red-500 rounded-lg sm:w-[430px] transition-all flex flex-col overflow-hidden shadow-md hover:shadow-lg">
      {/* 🖼️ Bagian Gambar */}
      <div className="relative overflow-hidden h-[250px]">
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* 📜 Bagian Konten */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
          <span className="italic text-sm text-gray-500">{post.category}</span>
        </div>
      </div>

      {/* 📌 Bagian Tombol */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to={`/post/${post.slug}`}
          className="block text-center border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 py-2 rounded-md"
        >
          Baca Artikel Selengkapnya
        </Link>
      </div>
    </div>
  );
}
