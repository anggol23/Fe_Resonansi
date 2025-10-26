import { Modal, Table, Button, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    const token = currentUser?.accessToken || localStorage.getItem("access_token");
    if (!token) {
      console.error("❌ Tidak ada token di localStorage!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/user/getusers?limit=20&sort=desc`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        console.error("❌ Error Fetch:", data.message);
      }
    } catch (error) {
      console.error("🔥 Error Fetching:", error.message);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchUsers();
    }
  }, [currentUser]);

  const handleDeleteUser = async () => {
    setLoading(true);
  const token = currentUser?.accessToken || localStorage.getItem("access_token");
    if (!token) {
      console.error("❌ Tidak ada token di localStorage!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Pengguna berhasil dihapus!");
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        alert(`❌ Error Hapus: ${data.message}`);
      }
    } catch (error) {
      alert(`🔥 Error Menghapus Pengguna: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setLoading(true);
  const token = currentUser?.accessToken || localStorage.getItem("access_token");
    if (!token) {
      console.error("❌ Tidak ada token di localStorage!");
      setLoading(false);
      return;
    }
  
    try {
      const res = await fetch(`${API_URL}/api/user/update-role/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("✅ Role berhasil diperbarui!");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        console.error(`❌ Error Perbarui Role: ${data.message}`);
      }
    } catch (error) {
      console.error(`🔥 Error Memperbarui Role: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-3">
      {currentUser?.role === "admin" && users.length > 0 ? (
        <>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Tanggal Dibuat</Table.HeadCell>
              <Table.HeadCell>Gambar Pengguna</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell>Hapus</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <Table.Row key={user._id}>
                  <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full" />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={loading}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      className="text-accent-700 hover:text-accent-800"
                      onClick={() => {
                        setUserIdToDelete(user._id);
                        setShowModal(true);
                      }}
                      disabled={loading}
                      title="Hapus pengguna"
                    >
                      <FaTrash />
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Modal Konfirmasi Hapus */}
          {showModal && (
            <Modal show={showModal} onClose={() => setShowModal(false)}>
              <Modal.Header>Hapus Pengguna</Modal.Header>
              <Modal.Body>
                <div className="flex items-center gap-2">
                  <HiOutlineExclamationCircle className="text-accent-700" size={30} />
                  <p>Apakah Anda yakin ingin menghapus pengguna ini?</p>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button color="failure" onClick={handleDeleteUser} disabled={loading}>
                  {loading ? "Menghapus..." : "Hapus"}
                </Button>
                <Button onClick={() => setShowModal(false)} disabled={loading} color="gray">
                  Batal
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </>
      ) : (
        <p>Tidak ada pengguna ditemukan!</p>
      )}
    </div>
  );
}
