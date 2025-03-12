import { useNavigate } from "react-router";
import { useAuth } from "../provider/authProvider";

const Login = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    setToken("Token percobaan");
    navigate("/", { replace: true });
  };

  setTimeout(() => {
    handleLogin();
  }, 3 * 1000);

  return <div>login page</div>;
};

export default Login;
