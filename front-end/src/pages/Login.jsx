import { useState } from "react";
import { useAuth } from "../provider/authProvider";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = formData;
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, setToken]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await res.json();
      const { accessToken } = data;

      setToken(accessToken);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="bg-slate-800">
      <h1>Login</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col  m-auto gap-4  items-center justify-center  h-12  min-h-screen"
      >
        <input
          type="text"
          className=" border border-black px-2 rounded-lg"
          name="username"
          value={username}
          onChange={handleChange}
          placeholder="username"
        />
        <input
          type="password"
          className="border border-black px-2  rounded-lg"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="password"
        />
        <button className="mt-1 bg-blue-500 w-24 rounded-xl text-white py-1 hover:bg-blue-600 cursor-pointer">
          Login
        </button>
      </form>
    </div>
  );
}
