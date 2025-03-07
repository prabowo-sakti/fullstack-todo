import { createBrowserRouter, RouterProvider } from "react-router";
import Register from "../assets/components/Register";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../provider/authProvider";
import TodoApp from "../TodoApp";
import ErrorBoundary from "../ErrorBoundary";

const Routes = () => {
  const { token } = useAuth();

  const routesForPublic = [
    {
      path: "/contact-us",
      element: <div>Halaman kontak</div>,
    },
    {
      path: "/about-us",
      element: <div>Tentang kami</div>,
    },

    {
      path: "/register",
      element: <Register />,
    },
  ];

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          index: true,
          path: "dashboard",
          element: <div>dashboard</div>,
          errorElement: <ErrorBoundary />,
        },
        {
          path: "logout",
          element: <div>Logout</div>,
          errorElement: <ErrorBoundary />,
        },
        {
          path: "create-whisper",
          element: <TodoApp />,
          errorElement: <ErrorBoundary />,
        },
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <div>Home page</div>,
    },
    {
      path: "/login",
      element: <div>Login</div>,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...(token ? routesForAuthenticatedOnly : routesForNotAuthenticatedOnly),
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
