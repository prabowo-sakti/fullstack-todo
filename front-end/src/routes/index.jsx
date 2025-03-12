import { createBrowserRouter, RouterProvider } from "react-router";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../provider/authProvider";
import TodoApp from "../TodoApp";
import ErrorBoundary from "../ErrorBoundary";
import Login from "../pages/Login";
import Logout from "../pages/Logout";

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
          element: <TodoApp />,
          errorElement: <ErrorBoundary />,
        },
        {
          path: "logout",
          element: <Logout />,
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
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
