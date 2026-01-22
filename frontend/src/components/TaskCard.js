
function TaskCard({ task, onDelete }) {
  return (
    <div className="col-md-4 mb-3">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{task.title}</h5>
          <p className="card-text">{task.description}</p>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(task._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
