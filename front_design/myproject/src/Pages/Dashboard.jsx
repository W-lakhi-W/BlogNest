import React, { useEffect, useState } from "react";
import BlogCard from "../Components/BlogCard";
import axios from "axios";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/dashboard/blogs/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="p-6 text-yellow-600 font-medium">Loading...</p>;

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <h1 className="text-3xl font-bold text-yellow-700 mb-8 text-center">
        📝 My Blogs
      </h1>

      {blogs.length === 0 ? (
        <p className="text-gray-600 text-center">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
