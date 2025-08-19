// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/Authcontext";

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });

//   const { setUser, login } = useAuth();

//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:8000/api/login/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Store token & username, and update AuthContext
//         login(data.access, { username: formData.username });
//         navigate("/dashboard");
//       } else {
//         setError(data.detail || "Invalid credentials");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Try again.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-[88vh] bg-gradient-to-br from-yellow-50 to-white">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
//         {error && <p className="text-red-500 text-center">{error}</p>}
//         <form onSubmit={handleSubmit} className="space-y-4" noValidate>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Username
//             </label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { setUser, login } = useAuth();

  // Individual field errors
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // General form error (e.g., non-field error or detail message)
  const [formError, setFormError] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear field-specific errors on change
    if (e.target.name === "username") setUsernameError("");
    else if (e.target.name === "password") setPasswordError("");
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setUsernameError("");
    setPasswordError("");
    setFormError("");

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token & username, and update AuthContext
        login(data.access, { username: formData.username });
        navigate("/dashboard");
      } else {
        // Handle backend validation errors which may be field-specific or general detail
        if (data.username) {
          setUsernameError(
            Array.isArray(data.username) ? data.username[0] : data.username
          );
        }
        if (data.password) {
          setPasswordError(
            Array.isArray(data.password) ? data.password[0] : data.password
          );
        }
        if (data.detail && !data.username && !data.password) {
          setFormError(data.detail);
        }

        // Fallback if no known error key
        if (
          !data.username &&
          !data.password &&
          !data.detail &&
          Object.keys(data).length > 0
        ) {
          const errors = Object.values(data)
            .flat()
            .join(" ");
          setFormError(errors || "Invalid login credentials.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[88vh] bg-gradient-to-br from-yellow-50 to-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {formError && (
          <p className="text-red-500 text-center mb-4" role="alert" aria-live="polite">
            {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                usernameError ? "border-red-500 focus:ring-red-500" : "focus:ring-yellow-400"
              }`}
              required
              aria-invalid={!!usernameError}
              aria-describedby={usernameError ? "username-error" : undefined}
              disabled={loading}
            />
            {usernameError && (
              <p
                id="username-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {usernameError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                passwordError ? "border-red-500 focus:ring-red-500" : "focus:ring-yellow-400"
              }`}
              required
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? "password-error" : undefined}
              disabled={loading}
            />
            {passwordError && (
              <p
                id="password-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
