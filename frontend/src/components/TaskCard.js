function TaskCard({
  task,
  onDelete,
  onEdit,
  onUpdate,
  editingTaskId,
  editForm,
  onEditChange
}) {
  const isEditing = editingTaskId === task._id;

  return (
    <div className="col-md-4 mb-3">
      <div className="card">
        <div className="card-body">
          {isEditing ? (
            <>
              <input
                className="form-control mb-2"
                name="title"
                value={editForm.title}
                onChange={onEditChange}
              />
              <input
                className="form-control mb-2"
                name="description"
                value={editForm.description}
                onChange={onEditChange}
              />
            </>
          ) : (
            <>
              <h5 className="card-title">{task.title}</h5>
              <p className="card-text">{task.description}</p>
            </>
          )}

          <div className="d-flex gap-2">
            {isEditing ? (
              <button
                className="btn btn-warning btn-sm"
                onClick={() => onUpdate(task._id)}
              >
                Update
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onEdit(task)}
              >
                Edit
              </button>
            )}

            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
