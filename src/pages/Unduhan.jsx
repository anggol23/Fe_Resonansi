import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Unduhan() {
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/unduhan/published`);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Gagal mengambil data file");
      }
      const data = await response.json();
      console.log("Data file:", data); // Debug
      setFiles(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleDownload = async (fileUrl, filename) => {
    if (!fileUrl) {
      alert("File tidak tersedia untuk diunduh.");
      return;
    }

    try {
      setDownloadingId(filename);

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Gagal mengunduh file");

      const blob = await response.blob();

      // 🔍 Ambil ekstensi dari fileUrl, default ke mimetype jika gagal
      let extension = "";
      try {
        const urlParts = fileUrl.split("?");
        const cleanUrl = urlParts[0];
        extension = cleanUrl.substring(cleanUrl.lastIndexOf(".") + 1);
        if (!extension || extension.length > 5) extension = ""; // fail-safe
      } catch (e) {
        console.warn("Ekstensi file tidak ditemukan dari URL:", e);
      }

      // 🔒 Cek dari response header jika perlu
      const contentType = response.headers.get("content-type");
      if (!extension && contentType) {
        const mimeMap = {
          "application/pdf": "pdf",
          "application/msword": "doc",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
          "application/vnd.ms-excel": "xls",
          "application/zip": "zip",
        };
        extension = mimeMap[contentType] || "";
      }

      const safeFilename = `${filename}${extension ? `.${extension}` : ""}`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = safeFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengunduh file.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="redaksi min-h-screen p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center my-7">Unduhan</h1>
      <div className="w-100 h-1 bg-red-600 mx-auto my-7" />

      {errorMessage && (
        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {files.length > 0 ? (
          files.map((file) => {
            const title = file.title || file.filename || "file";
            return (
              <div
                key={file._id}
                className="border p-4 rounded-lg shadow-lg w-full max-w-sm"
              >
                {file.imagePath && (
                  <img
                    src={file.imagePath}
                    alt={`Thumbnail dari ${title}`}
                    className="w-full h-40 object-contain rounded mb-3"
                  />
                )}
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB | {file.mimetype}
                </p>
                <button
                  onClick={() => handleDownload(file.fileUrl, title)}
                  className="mt-3 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
                  disabled={downloadingId === title}
                >
                  {downloadingId === title ? "Downloading..." : "Download"}
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-full text-gray-500">
            Belum ada file untuk diunduh.
          </p>
        )}
      </div>
    </div>
  );
}
