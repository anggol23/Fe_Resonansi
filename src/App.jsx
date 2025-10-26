import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "./components/Header";

import Home from "./pages/Home";

import Resonansi from "./pages/Resonansi";

import Artikel from "./pages/Artikel";

import KirimTulisan from "./pages/KirimTulisan";

import Redaksi from "./pages/Redaksi";

import Unduhan from "./pages/Unduhan";

import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";

import PostDetail from "./pages/PostDetail";

import OAuthSuccess from "./pages/OAuthSuccess";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import SearchResults from "./pages/SearchResults";


import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";

import Footer from "./components/Footer";

export default function App() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <Header key={currentUser?._id || "guest"} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resonansi" element={<Resonansi />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/kirim-tulisan" element={<KirimTulisan />} />
        <Route path="/redaksi" element={<Redaksi />} />
        <Route path="/unduhan" element={<Unduhan />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
  <Route path="/search" element={<SearchResults />} />

        <Route path="/oauth-success" element={<OAuthSuccess />} />

        <Route path="/post/:slug" element={<PostDetail />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
