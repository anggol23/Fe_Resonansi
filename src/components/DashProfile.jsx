import { Alert, Button, TextInput } from "flowbite-react";
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
      const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setImageFileUrl(data.secure_url);
        setFormData((prev) => ({ ...prev, profilePicture: data.secure_url }));
      } else {
        throw new Error("Failed to upload image.");
      }
    } catch (error) {
      setUpdateUserError("Error uploading image.");
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

    if (!token) {
      setUpdateUserError("Unauthorized: No token found");
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
      console.log("📌 Data yang dikirim ke API:", formData);

      const res = await fetch(`${API_URL}/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update user.");
      }

      dispatch(updateSuccess(data));
      setUpdateUserSuccess("Profile updated successfully.");
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!token) {
      setUpdateUserError("Unauthorized: No token found");
      return;
    }

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${API_URL}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user.");
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
      if (!res.ok) throw new Error("Failed to sign out");
      dispatch(signoutSuccess());
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileUrl || "/default-avatar.png"}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>

        <TextInput id="username" placeholder="Username" defaultValue={currentUser?.username} onChange={handleChange} />
        <TextInput id="email" type="email" placeholder="Email" defaultValue={currentUser?.email} onChange={handleChange} />
        <TextInput id="password" type="password" placeholder="New Password" onChange={handleChange} />

        <Button type="submit" color="failure" outline disabled={loading || imageFileUploading}>
          {loading || imageFileUploading ? "Updating..." : "Update"}
        </Button>
      </form>

      {currentUser?.role === "admin" && (
        <div className="mt-1">
          <Button as={Link} gradientMonochrome="failure" to="/create-post">
            Create Post
          </Button>
        </div>
      )}

      {updateUserError && <Alert color="failure">{updateUserError}</Alert>}
      {updateUserSuccess && <Alert color="success">{updateUserSuccess}</Alert>}

      <div className="flex justify-between mt-5">
        <Button color="failure" outline onClick={handleSignout}>
          Sign Out
        </Button>
        <Button color="failure" outline onClick={handleDeleteUser}>
          Delete Account
        </Button>
      </div>
    </div>
  );
}
