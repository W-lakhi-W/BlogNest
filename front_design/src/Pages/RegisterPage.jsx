import React, { useState } from "react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  // Field-specific error states
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password2Error, setPassword2Error] = useState("");

  // General errors and success messages
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear errors for the edited field and general messages
    switch (e.target.name) {
      case "username":
        setUsernameError("");
        break;
      case "email":
        setEmailError("");
        break;
      case "password":
        setPasswordError("");
        break;
      case "password2":
        setPassword2Error("");
        break;
      default:
        break;
    }
    setFormError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear all previous errors/messages
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setPassword2Error("");
    setFormError("");
    setSuccess("");

    if (formData.password !== formData.password2) {
      setPassword2Error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful. You can now login.");
        setFormData({
          username: "",
          email: "",
          password: "",
          password2: "",
        });
      } else if (data) {
        // Handle field-specific errors
        if (data.username) {
          setUsernameError(
            Array.isArray(data.username) ? data.username[0] : data.username
          );
        }
        if (data.email) {
          setEmailError(Array.isArray(data.email) ? data.email[0] : data.email);
        }
        if (data.password) {
          setPasswordError(
            Array.isArray(data.password) ? data.password[0] : data.password
          );
        }
        if (data.password2) {
          setPassword2Error(
            Array.isArray(data.password2) ? data.password2[0] : data.password2
          );
        }
        // Generic error message under form if no field errors
        if (
          !data.username &&
          !data.email &&
          !data.password &&
          !data.password2 &&
          data.detail
        ) {
          setFormError(data.detail);
        }

        // Fallback generic errors from other keys if present
        if (
          !data.username &&
          !data.email &&
          !data.password &&
          !data.password2 &&
          !data.detail &&
          Object.keys(data).length > 0
        ) {
          const errors = Object.values(data).flat().join(" ");
          setFormError(errors || "Registration failed. Please try again.");
        }
      } else {
        setFormError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh] bg-gradient-to-br from-yellow-50 to-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Register
        </h2>

        {formError && (
          <p
            className="text-red-500 text-center mb-4"
            role="alert"
            aria-live="polite"
          >
            {formError}
          </p>
        )}
        {success && (
          <p
            className="text-yellow-600 text-center mb-4"
            role="alert"
            aria-live="polite"
          >
            {success}
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
                usernameError
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-yellow-400"
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
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                emailError
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-yellow-400"
              }`}
              required
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              disabled={loading}
            />
            {emailError && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {emailError}
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
                passwordError
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-yellow-400"
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

          <div>
            <label
              htmlFor="password2"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="password2"
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                password2Error
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-yellow-400"
              }`}
              required
              aria-invalid={!!password2Error}
              aria-describedby={password2Error ? "password2-error" : undefined}
              disabled={loading}
            />
            {password2Error && (
              <p
                id="password2-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {password2Error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
