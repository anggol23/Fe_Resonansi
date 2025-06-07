import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser, token } = useSelector((state) => state.user);

  const CLOUD_NAME = "dmmcoztd7";
  const UPLOAD_PRESET = "gambar";

  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    const fetchPost = async () => {
      setLoading(true);
      try {
        console.log("📥 Fetching post with ID:", postId);
        const res = await fetch(`/api/posts/getpost/${postId}`, {
          signal: controller.signal,
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch post");
        }

        if (!data.post) {
          throw new Error("Post not found");
        }

        console.log("📝 Post data:", data.post);
        setFormData((prev) => ({ ...prev, ...data.post }));
        setPublishError(null);
      } catch (error) {
        if (error.name !== "AbortError") {
          setPublishError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    } else {
      setPublishError("Post ID is missing");
      setLoading(false);
    }

    return () => controller.abort();
  }, [postId]);

  // ✅ Handle Gambar sebelum Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreviewImage(URL.createObjectURL(file)); // Buat preview sebelum upload
  };

  // ✅ Handle Upload Gambar ke Cloudinary
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    setImageUploadError(null);

    const imageFormData = new FormData();
    imageFormData.append("file", file);
    imageFormData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: imageFormData,
      });

      const data = await res.json();

      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Image upload failed");
      }

      console.log("✅ Image uploaded:", data.secure_url);

      // ✅ Update formData dengan gambar baru
      setFormData((prev) => ({ ...prev, image: data.secure_url }));

      // ✅ Reset preview setelah berhasil upload
      setPreviewImage(null);
    } catch (error) {
      setImageUploadError(error.message);
    }
  };

  // ✅ Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📤 Data yang dikirim ke backend:", formData);

    // Pastikan title, category, dan image sudah ada sebelum submit
    if (!formData.title.trim()) {
      setPublishError("Title is required");
      return;
    }

    if (!formData.category) {
      setPublishError("Please select a category");
      return;
    }

    if (!formData.image) {
      setPublishError("Please upload an image before updating");
      return;
    }

    try {
      const { _id, ...updateData } = formData;

      const res = await fetch(`${API_URL}/api/posts/update/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      console.log("✅ Response dari backend:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to update post");
      }

      navigate(`${API_URL}/post/${data.slug}`);
    } catch (error) {
      setPublishError(error.message);
    }
  };

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading post...</div>;
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Title"
          required
          id="title"
          className="flex-1"
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          value={formData.title}
        />

        <Select
          onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
          value={formData.category}
          required
        >
          <option value="">Select a category</option>
          <option value="pendidikan">Pendidikan</option>
          <option value="sosial">Sosial</option>
          <option value="ekonomi">Ekonomi</option>
          <option value="politik">Politik</option>
        </Select>

        <FileInput type="file" accept="image/*" onChange={handleFileChange} />
        <Button onClick={handleUploadImage} type="button" disabled={!file}>
          {file ? "Upload Image" : "Select File First"}
        </Button>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {/* 🖼️ Preview Gambar Sebelum Upload */}
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-auto rounded-lg shadow-md"
          />
        )}

        {/* 🖼️ Gambar yang sudah diupload */}
        {formData.image && !previewImage && (
          <img
            src={formData.image}
            alt="Uploaded"
            className="w-full h-auto rounded-lg shadow-md"
          />
        )}

        <ReactQuill
          value={formData.content}
          onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
        />

        <Button type="submit">Update Post</Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
