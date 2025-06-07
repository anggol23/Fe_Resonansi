import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

const API_URL = import.meta.env.VITE_API_URL;

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        console.log("🔍 Current URL:", window.location.href);
        console.log("🔐 Token ditemukan:", token);

        if (!token) {
          console.warn("❌ Token tidak ada di URL.");
          setLoading(false);
          return navigate("/sign-in");
        }

        // Simpan token ke localStorage
        localStorage.setItem("access_token", token);

        // Ambil data user menggunakan token
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("❌ Gagal ambil data user dari token");
        }

        const data = await response.json();
        console.log("✅ User data:", data);

        if (!data || !data.user) {
          throw new Error("❌ Data user kosong atau tidak valid");
        }

        // Dispatch ke Redux
        dispatch(signInSuccess({ user: data.user, access_token: token }));

        // Navigasi berdasarkan role
        if (data.user.role === "admin") {
          navigate("/dashboard?tab=dash");
        } else {
          navigate("/");
        }

      } catch (err) {
        console.error("⚠️ Error saat login OAuth:", err.message);
        navigate("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    checkOAuth();
  }, [navigate, dispatch]);

  if (loading) {
    return <p className="text-center mt-20">Login dengan Google... Mohon tunggu...</p>;
  }

  return null;
};

export default OAuthSuccess;
