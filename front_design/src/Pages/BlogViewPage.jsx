import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const BlogViewPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`http://127.0.0.1:8000/api/blogs/${id}/`) // Note trailing slash
      .then((res) => {
        setBlog(res.data);
      })
      .catch((err) => {
        console.error("Error fetching blog:", err);
        setError(
          err.response?.status === 404
            ? "Blog not found."
            : "Failed to load blog. Please try again."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-yellow-700">Loading blog...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold" role="alert">
        {error}
      </p>
    );
  if (!blog)
    return <p className="text-center mt-10 text-gray-500">Blog not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 overflow-x-hidden">
      <h1 className="text-4xl font-bold mb-2 text-yellow-700 break-words">
        {blog.title}
      </h1>

      <p className="text-sm text-gray-600 mb-6 break-words">
        By <span className="font-medium">{blog.owner}</span>
      </p>

      <article
        className="prose prose-lg text-justify break-words whitespace-pre-wrap max-w-full"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
};

export default BlogViewPage;
