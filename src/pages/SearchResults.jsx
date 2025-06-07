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