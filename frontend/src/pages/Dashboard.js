import axios from 'axios';
import { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/tasks', config);
      // Backend now returns { success: true, count: X, tasks: [...] }
      setTasks(res.data.tasks || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.response?.data?.msg || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle add form input change
  const handleChange = e =>
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });

  // Add new task
  const handleAdd = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', taskForm, config);
      setTaskForm({ title: '', description: '' });
      fetchTasks();
    } catch (err) {
      console.error('Error adding task:', err);
      alert(err.response?.data?.msg || 'Failed to add task');
    }
  };

  // Delete task
  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, config);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert(err.response?.data?.msg || 'Failed to delete task');
    }
  };

  // Start editing
  const handleEdit = task => {
    setEditingTaskId(task._id);
    setEditForm({ title: task.title, description: task.description });
  };

  // Handle edit input change
  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Update task
  const handleUpdate = async id => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        editForm,
        config
      );
      setEditingTaskId(null);
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      alert(err.response?.data?.msg || 'Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Task Form */}
      <form
        onSubmit={handleAdd}
        className="mb-4 p-3 border rounded shadow-sm"
        style={{ maxWidth: "420px" }}
      >
        <div className="mb-2">
          <input
            className="form-control"
            name="title"
            placeholder="Title"
            value={taskForm.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <textarea
            className="form-control"
            name="description"
            placeholder="Description"
            value={taskForm.description}
            onChange={handleChange}
            style={{ height: "90px" }}
            required
          />
        </div>

        <button className="btn btn-success btn-sm">Add Task</button>
      </form>

      {/* Display Tasks */}
      {tasks.length === 0 ? (
        <div className="alert alert-info">
          No tasks yet. Create your first task above!
        </div>
      ) : (
        <div className="row">
          {tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onUpdate={handleUpdate}
              editingTaskId={editingTaskId}
              editForm={editForm}
              onEditChange={handleEditChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;