import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TiptapEditor from "./TiptapEditor"; // Adjust path as needed

function EditModal() {
  const { id } = useParams(); // blog id from URL param
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Inline field errors
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  // General form message
  const [formMessage, setFormMessage] = useState("");

  const [loadingBlog, setLoadingBlog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoadingBlog(true);
      const token = localStorage.getItem("accessToken");
      axios
        .get(`http://127.0.0.1:8000/api/blogs/${id}/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .then((res) => {
          setBlog(res.data);
          setTitle(res.data.title || "");
          setContent(res.data.content || "");
          // Clear messages and errors on load
          setFormMessage("");
          setTitleError("");
          setContentError("");
        })
        .catch((err) => {
          console.error("Failed to load blog:", err);
          setFormMessage("❌ Failed to load blog data.");
        })
        .finally(() => {
          setLoadingBlog(false);
        });
    }
  }, [id]);

  if (loadingBlog) {
    return (
      <p className="text-center mt-10 text-yellow-600">Loading blog data...</p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setFormMessage("❌ You must be logged in to update the blog.");
      return;
    }

    // Clear previous errors and message
    setTitleError("");
    setContentError("");
    setFormMessage("");
    setLoading(true);

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/blogs/${blog.id}/`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFormMessage("✅ Blog updated successfully!");
      // Navigate to detail page after success
      navigate(`/detail/${blog.id}`);
    } catch (error) {
      console.error("Error updating blog:", error);
      if (error.response && error.response.data) {
        const data = error.response.data;

        // Set field-specific errors
        if (data.title) setTitleError(data.title[0]);
        if (data.content) setContentError(data.content[0]);

        // General error message handling
        if (data.detail) {
          setFormMessage(`❌ ${data.detail}`);
        } else if (!data.title && !data.content) {
          // Concatenate other errors if no specific fields
          const errors = Object.values(data).flat().join(" ");
          setFormMessage(
            `❌ ${errors || "Failed to update blog. Please try again."}`
          );
        }
      } else {
        setFormMessage("❌ Failed to update blog. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-yellow-600">✏️ Edit Blog</h2>

      {formMessage && (
        <p
          className={`mb-4 ${
            formMessage.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
          role="alert"
          aria-live="polite"
        >
          {formMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
            aria-invalid={!!titleError}
            aria-describedby={titleError ? "title-error" : undefined}
            className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              titleError
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-yellow-500"
            }`}
          />
          {titleError && (
            <p
              id="title-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {titleError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <TiptapEditor
            value={content}
            onChange={setContent}
            editorId="content"
            aria-invalid={!!contentError}
            aria-describedby={contentError ? "content-error" : undefined}
            disabled={loading}
          />
          {contentError && (
            <p
              id="content-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {contentError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}

export default EditModal;
