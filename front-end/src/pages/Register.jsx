import { useState } from "react";
import { useAuth } from "../provider/authProvider";
import { useNavigate } from "react-router";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { username, email, password } = formData;
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, email, password);
    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
        }),
      });
      const data = await res.json();
      const { accessToken } = data;
      console.log("data:", data);
      console.log("accessToken:", accessToken);
      console.log("{accessToken:}", accessToken);

      setToken(accessToken);
      // navigate("/");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-slate-800 m-auto gap-4  items-center justify-center  h-12  min-h-screen"
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
        type="email"
        className="border border-black px-2  rounded-lg"
        name="email"
        value={email}
        onChange={handleChange}
        placeholder="email"
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
        Daftar
      </button>
    </form>
  );
}
