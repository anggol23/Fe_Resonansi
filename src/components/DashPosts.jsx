import { Modal, Table, Button, Spinner, TextInput, Label, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import CustomQuill from "../components/CustomQuill";

const API_URL = import.meta.env.VITE_API_URL;
const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
    imageFile: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Token tidak ditemukan. Anda perlu login.");
      setLoading(false);
      return;
    }

    if (!currentUser || !currentUser._id || currentUser.role !== "admin") {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/posts/getposts?userId=${currentUser._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          if (data.posts.length === 0) {
            setError("You have no posts yet!");
          } else {
            setUserPosts(data.posts);
          }
        } else {
          throw new Error(data.message || "Failed to fetch posts");
        }
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [currentUser]);

  const handleDeletePost = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/posts/deleteposts/${postIdToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Post deleted successfully!");
        setUserPosts(userPosts.filter((post) => post._id !== postIdToDelete));
        setShowModal(false);
      } else {
        alert(`❌ Delete error: ${data.message}`);
      }
    } catch (error) {
      alert(`🔥 Error deleting post: ${error.message}`);
    }
  };

  const handleEditClick = (post) => {
    setIsEditing(true);
    setEditingPostId(post._id);
    setEditFormData({
      title: post.title,
      category: post.category,
      content: post.content || "",
      image: post.image,
      imageFile: null,
    });
    setShowEditModal(true);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return;

    let updatedImage = editFormData.image;
    if (editFormData.imageFile) {
      const formData = new FormData();
      formData.append("file", editFormData.imageFile);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      updatedImage = data.secure_url;
    }

    try {
      const res = await fetch(`${API_URL}/api/posts/update/${editingPostId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editFormData.title,
          category: editFormData.category,
          content: editFormData.content,
          image: updatedImage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) =>
          prev.map((post) =>
            post._id === editingPostId
              ? { ...post, title: editFormData.title, category: editFormData.category, content: editFormData.content, image: updatedImage }
              : post
          )
        );
        setIsEditing(false);
        setShowEditModal(false);
        alert("✅ Post updated!");
      } else {
        alert(`❌ Update failed: ${data.message}`);
      }
    } catch (error) {
      alert(`🔥 Error updating post: ${error.message}`);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3">
      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500 text-center">{error}</p>
          <Link to="/create-post">
            <Button color="blue">+ Create Your First Post</Button>
          </Link>
        </div>
      ) : userPosts.length > 0 ? (
        <>
          {/* Modal Edit Post */}
          <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
            <Modal.Header>Edit Post</Modal.Header>
            <Modal.Body>
              <form onSubmit={handleUpdatePost} className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <TextInput
                    id="title"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    id="category"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="pendidikan">Pendidikan</option>
                    <option value="sosial">Sosial</option>
                    <option value="ekonomi">Ekonomi</option>
                    <option value="politik">Politik</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <CustomQuill
                    value={editFormData.content}
                    onChange={(value) => setEditFormData({ ...editFormData, content: value })}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditFormData({ ...editFormData, imageFile: e.target.files[0] })}
                  />
                  {editFormData.image && (
                    <img src={editFormData.image} alt="Preview" className="mt-2 w-40 h-24 object-cover" />
                  )}
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button type="button" onClick={handleUpdatePost}>
                Update
              </Button>
              <Button color="gray" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal Delete Confirmation */}
          <Modal show={showModal} size="md" onClose={() => setShowModal(false)} popup>
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this post?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={handleDeletePost}>
                    Yes, I'm sure
                  </Button>
                  <Button color="gray" onClick={() => setShowModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>

          {/* Post List */}
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts.map((post) => (
                <Table.Row key={post._id}>
                  <Table.Cell>
                    <img src={post.image} alt="Post Image" className="w-20 h-14 object-cover" />
                  </Table.Cell>
                  <Table.Cell>{post.title}</Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell className="flex gap-2">
                    <Button size="xs" color="blue" onClick={() => handleEditClick(post)}>
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => {
                        setPostIdToDelete(post._id);
                        setShowModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-gray-500">You have no posts yet!</p>
          <Link to="/create-post">
            <Button color="failure">+ Create Your First Post</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
