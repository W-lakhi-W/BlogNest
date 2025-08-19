import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-white flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-600 mb-6">
          Welcome to BlogNest ✍️
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Discover stories, share your thoughts, and connect with a vibrant
          community of writers and readers. Your voice matters — start blogging
          today!
        </p>
        <Link
          to="/explore_blogs"
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md hover:bg-yellow-600 transition"
        >
          Explore Blogs
        </Link>
      </div>

      {/* Highlights */}
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-center max-w-5xl">
        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold text-yellow-600 mb-2">
            ✍️ Write Blogs
          </h3>
          <p className="text-gray-600 text-sm">
            Share your stories, experiences, and ideas with the world. Publish
            blogs easily.
          </p>
        </div>
        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold text-yellow-600 mb-2">
            🔍 Read & Discover
          </h3>
          <p className="text-gray-600 text-sm">
            Discover blogs from different categories and follow your favorite
            creators.
          </p>
        </div>
        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold text-yellow-600 mb-2">
            💬 Like & Comment
          </h3>
          <p className="text-gray-600 text-sm">
            Engage with the community by liking posts and leaving thoughtful
            comments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
