import axios from 'axios';
import { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (sortBy) params.append('sort', sortBy);
      
      const res = await axios.get(`http://localhost:5000/api/tasks?${params.toString()}`, config);
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
  }, [searchTerm, statusFilter, sortBy]);

  const handleChange = e =>
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });

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

  const handleEdit = task => {
    setEditingTaskId(task._id);
    setEditForm({ title: task.title, description: task.description });
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

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

  if (loading && tasks.length === 0) {
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

      {/* Add Task Form */}
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

      {/* Search and Filter Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Search & Filter</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Display Tasks */}
      {tasks.length === 0 ? (
        <div className="alert alert-info">
          No tasks found. {searchTerm || statusFilter ? 'Try adjusting your filters.' : 'Create your first task above!'}
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