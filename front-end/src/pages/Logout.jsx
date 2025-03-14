import { useNavigate } from "react-router";
import { useAuth } from "../provider/authProvider";
import Login from "./Login";

const Logout = () => {
  const { setToken } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    setToken();
    navigate("/", { replace: true });
  };

  setTimeout(() => {
    handleLogout();
  }, 3 * 1000);

  return <Login />;
};

export default Logout;
