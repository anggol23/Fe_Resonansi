import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import OAuth from "../components/OAuth";

const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_URL || "";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || ""; 
const API_URL = import.meta.env.VITE_API_URL;

export default function SignUp() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev); // ✅ Fungsi untuk toggle password visibility
  };

  const uploadImageToCloudinary = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); 

    const res = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    
    try {
      setLoading(true);
      setErrorMessage(null);
      let imageUrl = "";
      
      if (profileImage) {
        imageUrl = await uploadImageToCloudinary(profileImage);
      }
      
      const userData = { ...formData, profileImage: imageUrl };
      const res = await fetch(`${API_URL}/api/auth/signup`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }

      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Kiri */}
        <div className="flex-1">
          <Link to="/" className="font-extrabold dark:text-white text-3xl">
            Dashboard
            <span className="px-2 py-1 bg-red-600 rounded-lg text-white">
              Resonansi
            </span>
          </Link>
          <p className="text-sm mt-5">
            Ini merupakan dashboard resonansi. Anda bisa masuk menggunakan email
            dan kata sandi Anda, atau melalui Google.
          </p>
        </div>
        {/* Kanan */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Masukan Username" />
              <TextInput type="text" placeholder="Username" id="username" onChange={handleChange} />
            </div>
            <div>
              <Label value="Masukan Email" />
              <TextInput type="email" placeholder="Email" id="email" onChange={handleChange} />
            </div>
            <div className="relative">
              <Label value="Masukan Password" />
              <TextInput
                type={showPassword ? "text" : "password"} // ✅ Gunakan state showPassword
                placeholder="Password"
                id="password"
                onChange={handleChange}
                className="pr-10"
              />
              {/* Tombol toggle password */}
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
            <div>
              <Label value="Upload Profile Picture" />
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <Button gradientMonochrome="failure" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Already have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && <Alert className="mt-5" color="failure">{errorMessage}</Alert>}
        </div>
      </div>
    </div>
  );
}
