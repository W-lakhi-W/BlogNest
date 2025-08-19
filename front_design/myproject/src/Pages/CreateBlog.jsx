import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/Authcontext";
import TiptapEditor from "../Components/TiptapEditor";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth(); // May be optional for this component's logic

  const clearForm = () => {
    setTitle("");
    setContent("");
    setTitleError("");
    setContentError("");
    setFormMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setFormMessage("❌ You must be logged in to create a blog.");
      return;
    }

    // Clear previous errors
    setTitleError("");
    setContentError("");
    setFormMessage("");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      await axios.post("http://127.0.0.1:8000/api/blogs/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFormMessage("✅ Blog created successfully!");
      clearForm();

      // Optional: Redirect or refresh blog list here
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;

        // Set field-specific errors
        if (data.title) {
          setTitleError(data.title[0]);
        }
        if (data.content) {
          setContentError(data.content[0]);
        }

        // Show general error message if available
        if (data.detail) {
          setFormMessage(`❌ ${data.detail}`);
        } else if (!data.title && !data.content) {
          // Aggregate all other errors if fields not present
          const errors = Object.values(data).flat().join(" ");
          setFormMessage(
            `❌ ${errors || "Failed to create blog. Please try again."}`
          );
        }
      } else {
        setFormMessage("❌ Network or server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-600 mb-4">
        📝 Create New Blog
      </h2>

      {formMessage && (
        <p
          className={`mb-4 text-center font-medium ${
            formMessage.startsWith("✅") ? "text-green-600" : "text-red-500"
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
            className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              titleError
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-yellow-500"
            }`}
            aria-invalid={!!titleError}
            aria-describedby={titleError ? "title-error" : undefined}
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
          {/* Content editor with Tiptap */}
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
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;

