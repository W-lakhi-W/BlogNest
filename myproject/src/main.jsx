import { Children, StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import RootLayout from "./layout/RootLayout.jsx";
import CreateBlog from "./Pages/CreateBlog.jsx";
import PublicRoutes from "./Routes/PublicRoutes.jsx";
import EditModal from "./Components/EditModal.jsx";
import BlogViewPage from "./Pages/BlogViewPage.jsx";
import Home from "./Pages/Home.jsx";
import HomeBlogs from "./Pages/HomeBlogs.jsx";
import "./index.css";

import PrivateRoute from "./Routes/PrivateRoute.jsx";
import { AuthProvider } from "./context/Authcontext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <PublicRoutes>
            <Home />
          </PublicRoutes>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoutes>
            <LoginPage />
          </PublicRoutes>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoutes>
            <RegisterPage />{" "}
          </PublicRoutes>
        ),
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "create",
        element: (
          <PrivateRoute>
            <CreateBlog />
          </PrivateRoute>
        ),
      },
      {
        path: "edit/:id",
        element: (
          <PrivateRoute>
            <EditModal />
          </PrivateRoute>
        ),
      },
      {
        path: "detail/:id",
        element: <BlogViewPage />,
      },
      {
        path: "explore_blogs",
        element: <HomeBlogs />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
