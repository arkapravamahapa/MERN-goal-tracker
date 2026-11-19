const GoalItem = ({ goal, deleteGoal, toggleGoal }) => {
  return (
    <div className="flex items-center justify-between bg-sky-50/50 border border-sky-100 px-4 py-3 my-2.5 rounded-lg text-slate-800">
      <div className={`text-base font-medium ${goal.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
        {goal.text}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => toggleGoal(goal._id, !goal.completed)}
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 transition-colors"
        >
          {goal.completed ? 'Undo' : 'Complete'}
        </button>
        <button
          onClick={() => deleteGoal(goal._id)}
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default GoalItem;