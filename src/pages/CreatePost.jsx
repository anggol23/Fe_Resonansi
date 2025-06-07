import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CustomQuill from "../components/CustomQuill"; 

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  });
  const [uploading, setUploading] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const quillRef = useRef(null); 

  const API_URL = import.meta.env.VITE_API_URL;

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
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.content || !file) {
      setPublishError("Please fill in all fields and upload an image");
      return;
    }
  
    setUploading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setPublishError("No token found, please log in again.");
        return;
      }
  
      // Upload ke Cloudinary
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", file);
      cloudinaryData.append("upload_preset", "gambar");
  
      const cloudinaryRes = await fetch(
        "https://api.cloudinary.com/v1_1/dmmcoztd7/image/upload",
        {
          method: "POST",
          body: cloudinaryData,
        }
      );
  
      const cloudinaryJson = await cloudinaryRes.json();
      if (!cloudinaryRes.ok) {
        throw new Error("Cloudinary upload failed");
      }
  
      const imageUrl = cloudinaryJson.secure_url;
  
      // Kirim data post ke backend
      const formDataToSend = {
        title: formData.title,
        category: formData.category,
        content: formData.content,
        image: imageUrl,
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
        throw new Error("Invalid JSON response from server");
      }
  
      if (!res.ok) {
        setPublishError(data.message || "Failed to publish post");
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
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      {publishError && <Alert className="mb-4" color="failure">{publishError}</Alert>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
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
              Select a category
            </option>
            <option value="pendidikan">Pendidikan</option>
            <option value="sosial">Sosial</option>
            <option value="ekonomi">Ekonomi</option>
            <option value="politik">Politik</option>
            <option value="cerpen">Cerpen</option>
            <option value="puisi">Puisi</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-red-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {previewUrl && (
          <img
            src={previewUrl}
            alt="upload preview"
            className="w-full h-72 object-cover rounded-lg"
          />
        )}

        <CustomQuill
          ref={quillRef}
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        <Button type="submit" gradientMonochrome="failure" disabled={uploading}>
          {uploading ? "Uploading..." : "Publish"}
        </Button>
      </form>
    </div>
  );
}
