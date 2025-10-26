import { Alert, Button, TextInput, Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function DashProfile() {
  const { currentUser, token, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.profilePicture) {
      setImageFileUrl(currentUser.profilePicture);
    }
  }, [currentUser]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImageFileUrl(URL.createObjectURL(file));
    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    setImageFileUploading(true);
    try {
      // Gunakan ENV bila ada, jika tidak gunakan default agar tidak gagal diam-diam
      const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/dmmcoztd7/image/upload";
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "gambar";

      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", uploadPreset);

      const res = await fetch(cloudinaryUrl, {
        method: "POST",
        body: fd,
      });

      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (_) {
        // abaikan jika bukan JSON valid
      }
      if (!res.ok || !data?.secure_url) {
        const msg = data?.error?.message || "Gagal mengunggah gambar (periksa Cloudinary cloud name & upload preset)";
        setUpdateUserError(msg);
        return;
      }
      setImageFileUrl(data.secure_url);
      setFormData((prev) => ({ ...prev, profilePicture: data.secure_url }));
    } catch (error) {
      setUpdateUserError("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setImageFileUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    const authToken = token || localStorage.getItem("access_token");
    if (!authToken) {
      setUpdateUserError("Tidak diizinkan: Token tidak ditemukan");
      return;
    }

    if (Object.keys(formData).length === 0 && !imageFile) {
      setUpdateUserError("No changes made.");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for the image to finish uploading.");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`${API_URL}/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal memperbarui profil.");
      }

      const updatedUser = data?.user || data;
      dispatch(updateSuccess(updatedUser));
      setUpdateUserSuccess("Profil berhasil diperbarui.");
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    const authToken = token || localStorage.getItem("access_token");
    if (!authToken) {
      setUpdateUserError("Tidak diizinkan: Token tidak ditemukan");
      return;
    }

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${API_URL}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menghapus akun.");
      }

      dispatch(deleteUserSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/signout`, { method: "POST" });
      if (!res.ok) throw new Error("Gagal keluar");
      dispatch(signoutSuccess());
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profil</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
          title="Klik untuk memilih foto"
        >
          <img
            src={imageFileUrl || "/default-avatar.svg"}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
          {imageFileUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Spinner color="failure" />
            </div>
          )}
        </div>

        <TextInput id="username" placeholder="Username" defaultValue={currentUser?.username} onChange={handleChange} />
        <TextInput id="email" type="email" placeholder="Email" defaultValue={currentUser?.email} onChange={handleChange} />
        <TextInput id="password" type="password" placeholder="New Password" onChange={handleChange} />

        <Button type="submit" color="failure" outline disabled={loading || imageFileUploading}>
          {loading || imageFileUploading ? "Memperbarui..." : "Perbarui"}
        </Button>
      </form>

      {currentUser?.role === "admin" && (
        <div className="mt-1">
          <Button as={Link} gradientMonochrome="failure" to="/create-post">
            Buat Artikel
          </Button>
        </div>
      )}

      {updateUserError && <Alert color="failure">{updateUserError}</Alert>}
      {updateUserSuccess && <Alert color="success">{updateUserSuccess}</Alert>}

      <div className="flex justify-between mt-5">
        <Button color="failure" outline onClick={handleSignout}>
          Keluar
        </Button>
        <Button color="failure" outline onClick={handleDeleteUser}>
          Hapus Akun
        </Button>
      </div>
    </div>
  );
}
