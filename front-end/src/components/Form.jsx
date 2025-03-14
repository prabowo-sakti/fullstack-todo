import { useState } from "react";

function Form({ addTask, isLoading, setError, error }) {
  const [nameTasks, setNameTasks] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!nameTasks.trim()) {
      return setError("Mohon masukan task yang valid");
    }
    addTask(nameTasks);
    setNameTasks("");
  }

  return (
    <form className="flex flex-col items-center" onSubmit={handleSubmit}>
      <h2 className="w-full text-center">
        <label htmlFor="new-todo-input" className="text-lg font-light mb-4 p-2">
          What needs to be done?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        name="text"
        autoComplete="off"
        value={nameTasks}
        onChange={(e) => setNameTasks(e.target.value)}
        className="border-2 border-black p-8 w-full focus:border-gray-700 focus:ring-2 focus:ring-gray-700"
        placeholder="Add a new task "
        disabled={isLoading}
      />
      <button
        type="submit"
        className="mt-4 border border-gray-700 cursor-pointer px-4 py-2 capitalize bg-black text-white"
        disabled={isLoading}
      >
        {isLoading ? "Menambahkan..." : "Add Task"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

export default Form;
