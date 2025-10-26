import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  const { currentUser, token } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?.role !== "admin") return; // hanya admin bisa fetch data

    const authToken = token || currentUser?.accessToken || localStorage.getItem("access_token");

    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/user/getusers?limit=5&sort=desc`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setUsers(Array.isArray(data.users) ? data.users : []);
          const total =
            data.totalUsers ?? data.total ?? data.count ?? (Array.isArray(data.users) ? data.users.length : 0);
          setTotalUsers(total);
          setLastMonthUsers(data.lastMonthUsers ?? 0);
        } else {
          console.error("Fetch users failed:", data.message || data);
        }
      } catch (error) {
        console.error("Fetch users error:", error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/posts/getposts?limit=5&order=desc`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setPosts(Array.isArray(data.posts) ? data.posts : []);
          const total =
            data.totalPosts ?? data.total ?? data.count ?? (Array.isArray(data.posts) ? data.posts.length : 0);
          setTotalPosts(total);
          setLastMonthPosts(data.lastMonthPosts ?? 0);
        } else {
          console.error("Fetch posts failed:", data.message || data);
        }
      } catch (error) {
        console.error("Fetch posts error:", error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/comments/getcomments?limit=5&sort=desc`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setComments(Array.isArray(data.comments) ? data.comments : []);
          const total =
            data.totalComments ?? data.total ?? data.count ?? (Array.isArray(data.comments) ? data.comments.length : 0);
          setTotalComments(total);
          setLastMonthComments(data.lastMonthComments ?? 0);
        } else {
          console.error("Fetch comments failed:", data.message || data);
        }
      } catch (error) {
        console.error("Fetch comments error:", error.message);
      }
    };

    fetchUsers();
    fetchPosts();
    fetchComments();
  }, [currentUser, token]);

  return (
    <div className="p-3 md:mx-auto">
      {/* Summary cards */}
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-accent-700 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Bulan lalu</div>
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-accent-700 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Bulan lalu</div>
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-accent-700 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Bulan lalu</div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent users</h1>
            <Button outline color="failure">
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt="user"
                      className="w-10 h-10 rounded-full bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Recent Comments */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent comments</h1>
            <Button outline color="failure">
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments.map((comment) => (
                <Table.Row key={comment._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="w-96">
                    <p className="line-clamp-2">{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Recent Posts */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent posts</h1>
            <Button outline color="failure">
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {posts.map((post) => (
                <Table.Row key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    <img
                      src={post.image}
                      alt="post"
                      className="w-14 h-10 rounded-md bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell className="w-96">{post.title}</Table.Cell>
                  <Table.Cell className="w-5">{post.category}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}
