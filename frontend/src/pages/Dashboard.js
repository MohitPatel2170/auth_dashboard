import axios from 'axios';
import { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: '', description: '' });
  const token = localStorage.getItem('token');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', config);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  // Handle form input change
  const handleChange = e => setTaskForm({ ...taskForm, [e.target.name]: e.target.value });

  // Add new task
  const handleAdd = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', taskForm, config);
      setTaskForm({ title: '', description: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, config);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Add Task Form */}
      <form onSubmit={handleAdd} className="mb-4">
        <input
          className="form-control mb-2"
          name="title"
          placeholder="Title"
          value={taskForm.title}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          name="description"
          placeholder="Description"
          value={taskForm.description}
          onChange={handleChange}
          required
        />
        <button className="btn btn-success">Add Task</button>
      </form>

      {/* Display Tasks */}
      <div className="row">
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
