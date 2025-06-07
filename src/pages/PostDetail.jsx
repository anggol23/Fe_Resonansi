import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaUser, FaFacebook, FaTwitter, FaWhatsapp, FaInstagram, FaLink } from 'react-icons/fa';  // Ikon pembuat dan ikon berbagi
import CommentSection from '../components/CommentSection';
import { jwtDecode } from "jwt-decode"; // Perbaikan impor
import { format } from 'date-fns';  // Format waktu

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [previousPost, setPreviousPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/api/posts/post/${slug}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data.post);
        setPreviousPost(data.previous);
        setNextPost(data.next);
        setComments(data.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    if (!token) {
      alert("Anda harus login terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const res = await fetch(`${API_URL}/api/comments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment,
          postId: post._id,
          userId: userId,
          slug: post.slug,
        }),
      });

      if (res.ok) {
        const newCommentData = await res.json();
        setComments((prevComments) => [newCommentData, ...prevComments]);
        setNewComment("");
      } else {
        throw new Error("Failed to post comment");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Fungsi untuk menyalin link
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link berhasil disalin!");
  };

  // Periksa apakah post sudah ada sebelum melanjutkan render
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Pastikan post sudah ada sebelum render
  if (!post) return <p className="text-center">Post tidak ditemukan.</p>;

  // Format waktu pembuatan
  const createdAt = format(new Date(post.createdAt), 'dd MMMM yyyy');

  return (
    <div className="max-w-3xl mx-auto p-5">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-72 object-cover my-5 rounded-lg"
      />
      <h1 className="text-3xl text-center font-bold">{post.title}</h1>

      {/* Informasi Pembuat dan Waktu */}
      <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <FaUser />
          <span>{post.authorName}</span> {/* Ganti dari post.userId ke post.authorName */}
        </div>
        <span className="text-gray-400">|</span>
        <span>{createdAt}</span> {/* Menampilkan waktu dalam format tanggal, bulan, tahun */}
      </div>

      <div className="w-100 h-1 bg-red-600 mx-auto mt-25 my-7" />
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Pass post as a prop here */}
      <CommentSection
        post={post}  // Pass the post prop here
        comments={comments}
        newComment={newComment}
        handleCommentSubmit={handleCommentSubmit}
        setNewComment={setNewComment}
      />

      {/* Bagikan Link */}
      <div className="mt-5 flex justify-center space-x-6">
        <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank')}>
          <FaWhatsapp className="text-green-500 text-2xl hover:text-green-600" />
        </button>
        <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank')}>
          <FaTwitter className="text-blue-500 text-2xl hover:text-blue-600" />
        </button>
        <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
          <FaFacebook className="text-blue-700 text-2xl hover:text-blue-800" />
        </button>
        <button onClick={() => window.open(`https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}`, '_blank')}>
          <FaInstagram className="text-pink-600 text-2xl hover:text-pink-700" />
        </button>
        <button onClick={copyLink}>
          <FaLink className="text-gray-500 text-2xl hover:text-gray-600" />
        </button>
      </div>

      <div className="flex justify-between mt-8" style={{ borderTop: "1px solid #ccc", borderBottom: "1px solid #ccc", padding: "1rem 0" }}>
        {previousPost && (
          <div className="w-1/2 pr-4">
            <h3 className="text-xl font-semibold dark:text-gray-300">Artikel Sebelumnya</h3>
            <Link
              to={`/post/${previousPost.slug}`}
              className="text-red-500 hover:underline dark:text-red-400"
              onClick={scrollToTop}
            >
              {previousPost.title}
            </Link>
          </div>
        )}
        {nextPost && (
          <div className="w-1/2 pl-4">
            <h3 className="text-xl font-semibold dark:text-gray-300">Artikel Selanjutnya</h3>
            <Link
              to={`/post/${nextPost.slug}`}
              className="text-red-500 hover:underline dark:text-red-400"
              onClick={scrollToTop}
            >
              {nextPost.title}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
