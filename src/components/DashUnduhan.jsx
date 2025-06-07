import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Spinner, Alert } from "flowbite-react";
import { FaTrash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;
const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_URL || "";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || "";

export default function DashUnduhan() {
  const [filename, setFilename] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/unduhan`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Gagal mengambil data file");
      }
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gagal mengunggah gambar ke Cloudinary");

      return data.secure_url;
    } catch (error) {
      setErrorMessage(error.message || "Gagal mengunggah gambar ke Cloudinary");
      return null;
    }
  };

  const handlePublish = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!file || !image || !filename.trim()) {
      setErrorMessage("Semua field harus diisi.");
      return;
    }

    setLoading(true);

    try {
      // Upload gambar ke Cloudinary terlebih dahulu
      const imageUrl = await uploadImageToCloudinary(image);
      if (!imageUrl) throw new Error("Gagal mengunggah gambar");

      // Buat FormData untuk file utama
      const formData = new FormData();
      formData.append("filename", filename);
      formData.append("file", file);
      formData.append("imagePath", imageUrl); // Kirim URL gambar ke backend

      const response = await fetch(`${API_URL}/api/unduhan/upload`, {
        method: "POST",
        body: formData,
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal melakukan publish");
      }

      setSuccessMessage("File berhasil diunggah!");
      setFilename("");
      setFile(null);
      setImage(null);

      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";

      fetchFiles();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/unduhan/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Gagal menghapus file");

      setSuccessMessage("File berhasil dihapus!");
      fetchFiles();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-4xl mx-auto">
      {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
      {successMessage && <Alert color="success">{successMessage}</Alert>}

      <input
        type="text"
        placeholder="Masukkan nama file"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        className="border-2 p-2 rounded w-full mb-2"
      />

      <input
        type="file"
        id="fileInput"
        accept=".pdf,.doc,.docx,.txt"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files[0])}
        className="border-2 p-2 rounded w-full mb-2"
      />

      <input
        type="file"
        id="imageInput"
        accept="image/*"
        ref={imageInputRef}
        onChange={(e) => setImage(e.target.files[0])}
        className="border-2 p-2 rounded w-full mb-2"
      />

      <Button color="red" className="mt-4 w-full" onClick={handlePublish} disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Publish"}
      </Button>

      <Table className="mt-4">
        <Table.Head>
          <Table.HeadCell>Filename</Table.HeadCell>
          <Table.HeadCell>Size</Table.HeadCell>
          <Table.HeadCell>Type</Table.HeadCell>
          <Table.HeadCell>Preview</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {files.length > 0 ? (
            files.map((file) => (
              <Table.Row key={file._id}>
                <Table.Cell>{file.title || file.filename}</Table.Cell>
                <Table.Cell>{(file.size / 1024).toFixed(2)} KB</Table.Cell>
                <Table.Cell>{file.mimetype}</Table.Cell>
                <Table.Cell>
                  {file.imagePath && (
                    <img
                      src={file.imagePath}
                      alt={`Thumbnail dari ${file.title || file.filename}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(file._id)}
                    aria-label={`Hapus file ${file.title || file.filename}`}
                  >
                    <FaTrash />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center text-gray-500">
                No files uploaded yet.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
}
