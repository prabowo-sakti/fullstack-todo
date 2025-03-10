import { Navigate, Outlet } from "react-router";
import { useAuth } from "../provider/authProvider";

const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to={"/register"} />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
