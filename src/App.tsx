import { useEffect, useState } from 'react'
import {supabase } from "./supabase-client"
import './App.css'

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

function App() {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newDescription, setNewDescription] = useState("");

  const fetchTasks = async () => {
    const { error, data } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: true });

    if (error) {
      console.log("Error reading task", error.message);
      return;
    }

    setTasks(data);
  }

  const deleteTask = async (id: number) => {

    const {error} = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.log("Error deleting task", error.message);
    }
  }

  const updateTask = async (id: number) => {

    const {error} = await supabase
    .from("tasks")
    .update({description: newDescription})
    .eq("id", id);

    if (error) {
      console.log("Error updating task", error.message);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {error} = await supabase.from("tasks").insert(newTask).single();

    if (error) {
      console.log("Error adding task", error.message);
      return;
    }

    setNewTask({ title: "", description: "" });
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    console.log("Tasks updated:", tasks);
  }, [tasks]);

  


  return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem"}}>
        <h2>Task Manager CRUD</h2>

        <form  onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
          <input
            type='text'
            placeholder='Task Title'
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={{ width: '100%', marginBottom: "0.5rem", padding: "0.5rem" }}
          />
          <textarea
            placeholder='Task Description'
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{ width: '100%', marginBottom: "0.5rem", padding: "0.5rem" }}
          />
          <button type="submit" style={{ padding: "0.5rem 1rem"}}>Add Task</button>
        </form>

        <ul style={{ listStyleType: "none", padding: 0 }}>
          {tasks.map((task, key) => (
          <li
            key={key}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "4px",
              marginBottom: "0.5rem",
            }}
          >
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div>
                <textarea placeholder='Updated description...' onChange={(e) => setNewDescription(e.target.value)} />
                <button style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }} onClick={() => updateTask(task.id)}>Edit</button>
                <button onClick={() => deleteTask(task.id)} style={{ padding: "0.5rem 1rem" }}>Delete</button>
              </div>
            </div>
          </li>
          ))}
        </ul>
      </div>
  );
}

export default App
