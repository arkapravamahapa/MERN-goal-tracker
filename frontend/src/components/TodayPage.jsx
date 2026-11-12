import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Flame, LayoutList, Trash2 } from 'lucide-react';
import GoalForm from './GoalForm';

const TodayPage = ({ goals, addGoal, deleteGoal, toggleGoal, defaultFilter = 'Active' }) => {
  const [filter, setFilter] = useState(defaultFilter);

  // Filter logic
  const filteredGoals = goals.filter(goal => {
    if (filter === 'Active') return !goal.completed;
    if (filter === 'Completed') return goal.completed;
    return true; // 'All'
  });

  // Calculate quick stats
  // ... KEEP THE REST OF YOUR COMPONENT EXACTLY THE SAME ...
 

  // Calculate quick stats
  const activeCount = goals.filter(g => !g.completed).length;
  const completedCount = goals.filter(g => g.completed).length;
  const completionRate = goals.length === 0 ? 0 : Math.round((completedCount / goals.length) * 100);

  // Category Colors
  const getBadgeColor = (category) => {
    switch(category) {
      case 'Work & Career': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Sport & Health': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Personal Development': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* LEFT COLUMN: Main Task Area (Takes up 2/3 of space) */}
      <div className="flex-1 space-y-6">
        
        {/* Creation Form */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-base font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <LayoutList size={18} className="text-blue-600"/> Create New Task
          </h2>
          <GoalForm addGoal={addGoal} />
        </div>

        {/* Task List Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[500px]">
          {/* Panel Header & Filters */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 rounded-t-lg">
            <h2 className="text-base font-semibold text-gray-800">Current Action Items</h2>
            <div className="flex bg-gray-100 p-1 rounded-md text-xs font-medium">
              <button onClick={() => setFilter('All')} className={`px-3 py-1.5 rounded-md transition-all ${filter === 'All' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>All</button>
              <button onClick={() => setFilter('Active')} className={`px-3 py-1.5 rounded-md transition-all ${filter === 'Active' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Active</button>
              <button onClick={() => setFilter('Completed')} className={`px-3 py-1.5 rounded-md transition-all ${filter === 'Completed' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Completed</button>
            </div>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto p-2">
            {filteredGoals.length > 0 ? (
              <div className="space-y-1">
                {filteredGoals.map((goal) => (
                  <div key={goal._id} className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleGoal(goal._id, !goal.completed)} className="text-gray-400 hover:text-blue-600 transition-colors">
                        {goal.completed ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} />}
                      </button>
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${goal.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {goal.text}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getBadgeColor(goal.category)}`}>
                            {goal.category}
                          </span>
                          {goal.endDate && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Clock size={10} /> {new Date(goal.endDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteGoal(goal._id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* Enterprise Empty State */
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">You're all caught up!</h3>
                <p className="text-sm text-gray-500 max-w-[250px]">You don't have any {filter.toLowerCase()} tasks right now. Create a new goal above to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Widgets (Takes up 1/3 of space) */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        
        {/* Productivity Widget */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Flame size={16} className="text-orange-500"/> Productivity Score
          </h3>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-bold text-gray-900">{completionRate}%</span>
            <span className="text-sm text-gray-500 mb-1">completion</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
            <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2">
            <div>
              <p className="text-xs text-gray-500 mb-1">Active</p>
              <p className="text-lg font-semibold text-gray-800">{activeCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Done</p>
              <p className="text-lg font-semibold text-gray-800">{completedCount}</p>
            </div>
          </div>
        </div>

        {/* Mini Calendar/Upcoming Widget */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex-1">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-blue-500"/> Upcoming Deadlines
          </h3>
          <div className="space-y-4">
            {goals.filter(g => !g.completed && g.endDate).slice(0, 4).map(goal => (
               <div key={goal._id} className="flex gap-3">
                 <div className="w-10 h-10 rounded bg-gray-50 border border-gray-200 flex flex-col items-center justify-center shrink-0">
                   <span className="text-[10px] text-gray-400 uppercase font-semibold leading-none">{new Date(goal.endDate).toLocaleString('default', { month: 'short' })}</span>
                   <span className="text-sm font-bold text-gray-700 leading-tight">{new Date(goal.endDate).getDate()}</span>
                 </div>
                 <div className="flex flex-col justify-center overflow-hidden">
                   <span className="text-sm font-medium text-gray-800 truncate">{goal.text}</span>
                   <span className="text-xs text-gray-500 truncate">{goal.category}</span>
                 </div>
               </div>
            ))}
            {goals.filter(g => !g.completed).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TodayPage;