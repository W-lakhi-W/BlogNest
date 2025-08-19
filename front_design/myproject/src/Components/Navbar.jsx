import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { Menu, X } from "lucide-react"; // Make sure lucide-react is installed

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    logout?.();
    setMobileMenuOpen(false);
    window.location.reload();
  };

  const getLinkClass = ({ isActive }) =>
    isActive
      ? "text-yellow-700 font-semibold underline"
      : "text-yellow-600 hover:text-yellow-700 font-medium";

  const handleLinkClick = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-gradient-to-br from-yellow-50 to-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-extrabold text-yellow-600">
          BlogNest
        </NavLink>

        {/* Desktop Menu (Home link hidden here) */}
        <div className="hidden md:flex space-x-6 items-center">
          {user ? (
            <>
              <NavLink to="/dashboard" className={getLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/create" className={getLinkClass}>
                Create Blog
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={getLinkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2 rounded-md text-yellow-600 hover:bg-yellow-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          type="button"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-yellow-50 rounded-md shadow-md p-4 space-y-4">
          <div className="flex flex-col space-y-3">
            {/* Home link visible only on mobile */}
            <NavLink
              to="/explore_blogs"
              className={getLinkClass}
              onClick={handleLinkClick}
            >
              Home
            </NavLink>
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={getLinkClass}
                  onClick={handleLinkClick}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/create"
                  className={getLinkClass}
                  onClick={handleLinkClick}
                >
                  Create Blog
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={getLinkClass}
                  onClick={handleLinkClick}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition text-center"
                  onClick={handleLinkClick}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
