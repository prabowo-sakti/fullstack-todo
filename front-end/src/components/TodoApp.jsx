import { useState, useEffect } from "react";

import Form from "./Form";
import Todo from "./Todo";
import FilterButton from "./FilterButton";
import { useAuth } from "../provider/authProvider";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  function toggleTaskCompleted(id) {
    const updateTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updateTasks);
  }

  //function ini ada di todo.jsx
  const deleteTask = async (id) => {
    console.log(`Attempting to delete task with ID: ${id}`);
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/whisper/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setTasks((prevItems) => prevItems.filter((task) => id !== task.id));
        console.log(`Task with ID ${id} deleted successfully.`); // Debugging
      } else {
        throw new Error("Gagal dalam menghapus task");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, message: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
    try {
      fetch(`http://localhost:3000/api/v1/whisper/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newName }),
      });
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/whisper", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Path relatif
        if (!res.ok) {
          throw new Error("Oops, server lagi bermasalah");
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Data yang dikirimkan bukan array");
        }

        setTasks(data);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message); // Pastikan menggunakan 'err' bukan 'er'
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []); // Dependency array kosong untuk mencegah infinite loop

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        message={task.message}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => {
    return (
      <FilterButton
        key={name}
        name={name}
        isPressed={name === filter}
        setFilter={setFilter}
      />
    );
  });

  async function addTask(name) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/v1/whisper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: name }),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data from the server");
      }
      const data = await res.json();
      if (!data.id || !data.message) {
        throw new Error("Id atau message tidak lengkap");
      }
      const newTask = {
        message: data.message,
        id: data.id,
        completed: false,
      };

      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const taskNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${taskNoun} remaining`;

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg my-8">
        <h1 className="text-3xl font-bold text-center mb-6">Todo List</h1>
        <Form
          addTask={addTask}
          isLoading={isLoading}
          setError={setError}
          error={error}
        />
        <div className="flex space-x-4 my-4 absolute">{filterList}</div>
        <h2
          id="list-heading"
          tabIndex="-1"
          className="text-xl font-semibold mb-2"
        >
          {headingText}
        </h2>
        <ul aria-labelledby="list-heading" className="space-y-2" role="list">
          {taskList}
        </ul>
      </div>
    </>
  );
}

export default TodoApp;
