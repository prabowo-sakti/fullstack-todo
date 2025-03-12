import { Navigate, Outlet } from "react-router";
import { useAuth } from "../provider/authProvider";

const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to={"/register"} />;
  }

  return (
    <>
      <header>Ini menu header</header>
      <nav>menu</nav>
      <div>
        <Outlet />
      </div>
    </>
  );
};
export default ProtectedRoute;
