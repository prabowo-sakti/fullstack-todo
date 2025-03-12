import { useNavigate } from "react-router";
import { useAuth } from "../provider/authProvider";

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

  return <div>logout page</div>;
};

export default Logout;
