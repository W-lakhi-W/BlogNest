import React, { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../Components/BlogCard"; // Adjust import path accordingly

const HomeBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/blogs/")
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch blogs:", err);
      });
  }, []);

  // Handler to remove a blog from the list after deletion
  const handleDelete = (deletedId) => {
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== deletedId));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-yellow-600">
        📰 Latest Blogs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default HomeBlogs;
