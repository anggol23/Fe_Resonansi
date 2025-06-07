import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const CommentSection = ({ comments, newComment, handleCommentSubmit, setNewComment }) => {
  const [commentsData, setCommentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { slug } = useParams(); // Mendapatkan slug dari URL
  const token = localStorage.getItem('access_token'); // Mendapatkan token dari localStorage

  // Mengambil komentar dari API saat komponen dimuat
  useEffect(() => {
    const fetchComments = async () => {
      if (!slug) return;

      setLoading(true);
      setErrorMessage('');
      try {
        const response = await fetch(`${API_URL}/api/comments/getPostComments/${slug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Menambahkan token pada header
          },
        });

        if (!response.ok) {
          throw new Error('Gagal memuat komentar');
        }
        
        const data = await response.json();
        setCommentsData(data);
      } catch (error) {
        setErrorMessage('Terjadi kesalahan saat memuat komentar');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [slug, token]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold">Komentar</h2>
      <form onSubmit={handleCommentSubmit} className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Tulis komentar..."
          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          rows="4"
        ></textarea>
        <button
          type="submit"
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md dark:bg-red-600 dark:text-gray-100"
        >
          Kirim Komentar
        </button>
      </form>

      <div className="mt-6">
        {loading ? (
          <p className="dark:text-gray-400">Memuat komentar...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : commentsData.length > 0 ? (
          commentsData.map((comment) => (
            <div key={comment._id} className="p-4 border-b dark:border-gray-700" role="article">
              <div className="flex items-start mb-2">
                {/* Foto Profil */}
                {comment.profilePicture ? (
                  <img
                    src={comment.profilePicture}
                    alt={`${comment.username} profile`}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 mr-2" />
                )}
                {/* Nama Pengguna */}
                <span className="font-semibold">{comment.username || 'Anonymous'}: </span>
              </div>
              <p className="dark:text-white">{comment.content}</p>
              <div className="flex items-center mt-2">
                {/* Menghapus bagian tombol Like */}
                <span className="ml-2 dark:text-gray-400">
                  {comment.createdAt && (
                    <span className="ml-4 dark:text-gray-400 text-sm">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="dark:text-gray-400">Tidak ada komentar.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
