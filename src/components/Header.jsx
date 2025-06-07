import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  

  const handleSignout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/signout`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  // Fungsi untuk scroll ke atas
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Efek smooth scroll
    });
  };

  return (
    <Navbar className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-4">
      {/* Logo */}
      <Link to="/" className="flex items-center" onClick={scrollToTop}>
        <img src="/mockupresonansi2.png" alt="Logo" width="50" height="50" />
      </Link>

      {/* Mobile Search Button */}
      <Button className="lg:hidden" color="gray" pill onClick={() => navigate("/search")}>
        <AiOutlineSearch />
      </Button>

      {/* Right Side */}
      <div className="flex items-center gap-4 md:order-2">
        {/* Theme Toggle */}
        <Button className="hidden sm:inline" color="gray" pill onClick={() => dispatch(toggleTheme())}>
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>

        {/* User Dropdown */}
        {currentUser ? (
          <Dropdown arrowIcon={false} inline label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}>
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Dropdown.Item as={Link} to="/dashboard?tab=profile" onClick={scrollToTop}>
              Profile
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => {
                handleSignout(); // Menjalankan fungsi sign out
                scrollToTop();   // Scroll ke atas setelah sign out
              }}
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientMonochrome="failure" outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      {/* Navigation Links */}
      <Navbar.Collapse>
        {[{ name: "Resonansi", path: "/resonansi" },
          { name: "Artikel", path: "/artikel" },
          { name: "Kirim Tulisan", path: "/kirim-tulisan" },
          { name: "Redaksi", path: "/redaksi" },
          { name: "Unduhan", path: "/unduhan" }
        ].map(({ name, path }) => (
          <Navbar.Link
            key={path}
            as={Link}
            to={path}
            className={`px-3 py-2 text-gray-600 ${location.pathname === path ? "text-red-500 font-semibold border-b-2 border-red-500" : ""}`}
            onClick={scrollToTop} // Menambahkan scrollToTop saat menekan link
          >
            {name}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
}
