import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

const API_URL = import.meta.env.VITE_API_URL;

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Silakan isi semua bidang"));
    }

    try {
      dispatch(signInStart());

      const res = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login gagal");
      }

      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      dispatch(signInSuccess({ user: data.user, access_token: data.access_token }));

      navigate(data.role === "admin" ? "/dashboard?tab=dash" : "/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("googleLogin") === "success") {
      const fetchUser = async () => {
        try {
          const res = await fetch(`${API_URL}/api/auth/me`, {
            credentials: "include",
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Gagal ambil data user");

          dispatch(signInSuccess({ user: data.user }));
          navigate(data.role === "admin" ? "/dashboard?tab=dash" : "/");
        } catch (err) {
          dispatch(signInFailure(err.message));
        }
      };

      fetchUser();
    }
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Kiri */}
        <div className="flex-1">
          <Link to="/" className="font-extrabold dark:text-white text-3xl">
            Dashboard
            <span className="px-2 py-1 bg-red-600 rounded-lg text-white">Resonansi</span>
          </Link>
          <p className="text-sm mt-5">
            Ini merupakan dashboard resonansi. Anda bisa masuk menggunakan email dan kata sandi Anda, atau melalui Google.
          </p>
        </div>

        {/* Kanan */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Masukan Email" />
              <TextInput type="email" placeholder="Email" id="email" onChange={handleChange} />
            </div>
            <div className="relative">
              <Label value="Masukan Password" />
              <TextInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>

            <Button gradientMonochrome="failure" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2 mt-3"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                className="w-5 h-5"
              />
              Sign In with Google
            </Button>
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Belum punya akun?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
