import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CustomQuill from "../components/CustomQuill"; 
import ImageCropper from "../components/ImageCropper";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
    imageAlt: "",
  });
  const [uploading, setUploading] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const quillRef = useRef(null); 
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  // Cloudinary config: use env when provided, else fallback to previous defaults
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/dmmcoztd7/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "gambar";

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Fetch user error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      setPublishError("Only image files are allowed");
      return;
    }
    setFile(selectedFile);
    setPublishError("");
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setFormData((prev) => ({ ...prev, image: "" }));
    setCropSrc(url);
    setCropperOpen(true);
  };

  const handleUseImageUrl = () => {
    if (!imageUrlInput || !/^https?:\/\//i.test(imageUrlInput)) {
      setPublishError("Masukkan URL gambar yang valid (http/https)");
      return;
    }
    setPublishError("");
    setFile(null);
    setPreviewUrl(imageUrlInput);
    setFormData((prev) => ({ ...prev, image: imageUrlInput }));
    setCropSrc(imageUrlInput);
    setCropperOpen(true);
  };

  // Kompres gambar opsional sebelum upload
  const compressImage = (file, maxWidth = 1600, quality = 0.85) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Gagal kompres gambar"));
            const compressedFile = new File([blob], file.name.replace(/\.(png|jpg|jpeg|webp)$/i, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => reject(new Error("Tidak bisa memuat gambar"));
      img.src = URL.createObjectURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.content) {
      setPublishError("Lengkapi judul, kategori, dan konten");
      return;
    }
    if (!file && !formData.image && !previewUrl) {
      setPublishError("Tambahkan gambar unggahan atau URL gambar");
      return;
    }
  
    setUploading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setPublishError("Token tidak ditemukan, silakan login kembali.");
        return;
      }
  
      let imageUrl = formData.image;
      if (file) {
        // Kompres opsional sebelum upload
        let toUpload = file;
        try {
          toUpload = await compressImage(file);
        } catch (_) {
          toUpload = file;
        }

        const cloudinaryData = new FormData();
        cloudinaryData.append("file", toUpload);
        cloudinaryData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryRes = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: cloudinaryData,
        });

        const cloudinaryText = await cloudinaryRes.text();
        let cloudinaryJson = {};
        try {
          cloudinaryJson = JSON.parse(cloudinaryText);
        } catch (_) {
          // Biarkan kosong jika bukan JSON valid
        }
        if (!cloudinaryRes.ok || !cloudinaryJson?.secure_url) {
          const msg = cloudinaryJson?.error?.message || "Gagal mengunggah ke Cloudinary (periksa cloud name dan upload preset)";
          setPublishError(msg);
          setUploading(false);
          return;
        }
        imageUrl = cloudinaryJson.secure_url;
      }
  
      // Kirim data post ke backend
      const formDataToSend = {
        title: formData.title,
        category: formData.category,
        content: formData.content,
        image: imageUrl,
        imageAlt: imageAlt || formData.imageAlt || "",
        author: user?._id,
      };
  
      const res = await fetch(`${API_URL}/api/posts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(formDataToSend),
      });
  
      // **Cek apakah respons valid JSON**
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error("Respons server bukan JSON yang valid");
      }
  
      if (!res.ok) {
        setPublishError(data.message || "Gagal menerbitkan artikel");
        return;
      }
  
      if (data?.slug) {
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong, please try again");
      console.error("Error publishing post:", error);
    } finally {
      setUploading(false);
    }
  };
  

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Buat Artikel</h1>
      {publishError && <Alert className="mb-4" color="failure">{publishError}</Alert>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Judul"
            required
            id="title"
            className="flex-1"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="" disabled>
              Pilih kategori
            </option>
            <option value="pendidikan">Pendidikan</option>
            <option value="sosial">Sosial</option>
            <option value="ekonomi">Ekonomi</option>
            <option value="politik">Politik</option>
            <option value="cerpen">Cerpen</option>
            <option value="puisi">Puisi</option>
            <option value="jateng">Jateng</option>
            <option value="nasional">Nasional</option>
            <option value="teknologi">Teknologi</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="olahraga">Olahraga</option>
            <option value="travel">Travel</option>
          </Select>
        </div>

        {/* Pengaturan Gambar */}
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between border-4 border-red-500 border-dotted p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <FileInput type="file" accept="image/*" onChange={handleFileChange} />
              {previewUrl && (
                <Button color="gray" size="xs" type="button" onClick={() => { setFile(null); setPreviewUrl(""); setFormData((p)=>({...p,image:""})); }}>Hapus gambar</Button>
              )}
            </div>
            <div className="flex-1 w-full md:w-auto">
              <div className="flex gap-2">
                <TextInput
                  type="url"
                  placeholder="atau tempel URL gambar (https://...)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="w-full"
                />
                <Button color="failure" outline onClick={handleUseImageUrl} type="button">Pakai URL</Button>
              </div>
            </div>
          </div>

          {previewUrl && (
            <div>
              <img
                src={previewUrl}
                alt={imageAlt || "preview"}
                className="w-full aspect-video object-cover rounded-lg"
              />
              <div className="mt-2 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <TextInput
                  type="text"
                  placeholder="Teks alternatif (alt) gambar untuk aksesibilitas/SEO"
                  value={imageAlt}
                  onChange={(e) => { setImageAlt(e.target.value); setFormData((p)=>({...p,imageAlt:e.target.value})); }}
                />
                <Button type="button" color="failure" onClick={() => { setCropSrc(previewUrl); setCropperOpen(true); }}>Edit gambar</Button>
              </div>
            </div>
          )}
        </div>

        <CustomQuill
          ref={quillRef}
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        <Button type="submit" gradientMonochrome="failure" disabled={uploading}>
          {uploading ? "Mengunggah..." : "Terbitkan"}
        </Button>
      </form>
      {cropperOpen && (
        <ImageCropper
          src={cropSrc}
          aspect={16/9}
          onCancel={() => setCropperOpen(false)}
          onCropped={(blob) => {
            const newUrl = URL.createObjectURL(blob);
            setPreviewUrl(newUrl);
            setFile(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
            setFormData((p) => ({ ...p, image: "" }));
            setCropperOpen(false);
          }}
        />
      )}
    </div>
  );
}
