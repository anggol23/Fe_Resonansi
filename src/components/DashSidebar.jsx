import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL;

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  // ✅ Ambil tab dari URL secara otomatis
  const tab = useMemo(() => {
    return new URLSearchParams(location.search).get("tab") || "dash";
  }, [location.search]);

  // ✅ Fungsi sign out dengan error handling
  const handleSignout = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/user/signout`, { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      dispatch(signoutSuccess());
    } catch (error) {
      console.error("❌ Sign out error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk scroll ke atas
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Efek smooth scroll
    });
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {/* ✅ Dashboard hanya untuk Admin */}
          {currentUser?.role === "admin" && (
            <Sidebar.Item as={Link} to="/dashboard?tab=dash" active={tab === "dash"} icon={HiChartPie} onClick={scrollToTop}>
              Dashboard
            </Sidebar.Item>
          )}

          {/* ✅ Profile */}
          <Sidebar.Item as={Link} to="/dashboard?tab=profile" active={tab === "profile"} icon={HiUser} label={currentUser?.role === "admin" ? "Admin" : "User"} labelColor="dark" onClick={scrollToTop}>
            Profile
          </Sidebar.Item>

          {/* ✅ Posts hanya untuk Admin */}
          {currentUser?.role === "admin" && (
            <Sidebar.Item as={Link} to="/dashboard?tab=posts" active={tab === "posts"} icon={HiDocumentText} onClick={scrollToTop}>
              Posts
            </Sidebar.Item>
          )}

          {/* ✅ Users & Comments hanya untuk Admin */}
          {currentUser?.role === "admin" && (
            <>
              <Sidebar.Item as={Link} to="/dashboard?tab=users" active={tab === "users"} icon={HiOutlineUserGroup} onClick={scrollToTop}>
                Users
              </Sidebar.Item>
              {/* <Sidebar.Item as={Link} to="/dashboard?tab=comments" active={tab === "comments"} icon={HiAnnotation} onClick={scrollToTop}>
                Comments
              </Sidebar.Item> */}
              <Sidebar.Item as={Link} to="/dashboard?tab=unduhan" active={tab === "unduhan"} icon={HiDocumentText} onClick={scrollToTop}>
                Unduhan
              </Sidebar.Item>
            </>
          )}

          {/* ✅ Tombol Sign Out */}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className={`cursor-pointer ${loading ? "opacity-50" : ""}`}
            onClick={!loading ? handleSignout : undefined}
            disabled={loading} // Disable tombol saat loading
          >
            {loading ? "Signing out..." : "Sign Out"}
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
