const GoalItem = ({ goal, deleteGoal, toggleGoal }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      backgroundColor: '#f4f4f4', 
      padding: '15px', 
      margin: '10px 0',
      borderRadius: '5px',
      alignItems: 'center',
      color: '#333'
    }}>
      <div style={{ textDecoration: goal.completed ? 'line-through' : 'none', fontSize: '18px' }}>
        {goal.text}
      </div>
      <div>
        <button 
          onClick={() => toggleGoal(goal._id, !goal.completed)} 
          style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}
        >
          {goal.completed ? 'Undo' : 'Complete'}
        </button>
        <button 
          onClick={() => deleteGoal(goal._id)} 
          style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default GoalItem;