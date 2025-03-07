export default function Register() {
  return (
    <form className="flex flex-col bg-slate-800 m-auto gap-4  items-center justify-center  h-12  min-h-screen">
      <input
        type="text"
        className=" border border-black px-2 rounded-lg"
        required
        placeholder="username"
      />
      <input
        type="email"
        className="border border-black px-2  rounded-lg"
        required
        placeholder="email"
      />
      <input
        type="password"
        className="border border-black px-2  rounded-lg"
        required
        placeholder="password"
      />
      <button className="mt-1 bg-blue-500 w-24 rounded-xl text-white py-1 hover:bg-blue-600 cursor-pointer">
        Daftar
      </button>
    </form>
  );
}
