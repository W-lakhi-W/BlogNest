import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const BlogCard = ({ blog, onDelete }) => {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("username");
  const accessToken = localStorage.getItem("accessToken");

  // Show edit/delete buttons only if accessToken exists and logged-in user is the owner
  const canEdit = accessToken && currentUser === blog.owner;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/blogs/${blog.id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      onDelete(blog.id);
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/blogs/${blog.id}/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      navigate(`/edit/${response.data.id}`);
    } catch (error) {
      console.error("Failed to fetch blog for editing:", error);
      alert("Failed to load blog for editing. Please try again.");
    }
  };

  function getTruncatedTextFromHTML(html, wordLimit = 150) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    const words = plainText.trim().split(/\s+/);
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : plainText;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition max-w-full break-words">
      <h2 className="text-xl text-yellow-700 font-semibold mb-1 break-words">
        {blog.title}
      </h2>

      <p className="text-sm text-gray-500 mb-2 break-words">
        By: <span className="font-medium">{blog.owner}</span>
      </p>

      <p className="text-gray-700 mb-4 break-words whitespace-pre-wrap">
        {getTruncatedTextFromHTML(blog.content, 30)}
        <Link
          to={`/detail/${blog.id}`}
          className="text-yellow-600 hover:text-yellow-800 hover:underline ml-1"
        >
          Read more
        </Link>
      </p>

      {canEdit && (
        <div className="flex space-x-2 flex-wrap">
          <button
            className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogCard;
