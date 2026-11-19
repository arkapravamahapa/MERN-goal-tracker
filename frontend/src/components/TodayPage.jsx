import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Flame, LayoutList, Trash2 } from 'lucide-react';
import GoalForm from './GoalForm';

const TodayPage = ({ goals, addGoal, deleteGoal, toggleGoal, defaultFilter = 'Active' }) => {
  const [filterState, setFilterState] = useState({ route: defaultFilter, value: defaultFilter });
  const filter = filterState.route === defaultFilter ? filterState.value : defaultFilter;
  const setFilter = (value) => setFilterState({ route: defaultFilter, value });

  const filteredGoals = goals.filter(goal => {
    if (filter === 'Active') return !goal.completed;
    if (filter === 'Completed') return goal.completed;
    return true;
  });

  const activeCount = goals.filter(g => !g.completed).length;
  const completedCount = goals.filter(g => g.completed).length;
  const completionRate = goals.length === 0 ? 0 : Math.round((completedCount / goals.length) * 100);

  const listTitle =
    defaultFilter === 'Completed'
      ? 'Completed Archive'
      : defaultFilter === 'All'
      ? 'All Workspace Tasks'
      : 'Current Action Items';

  const getCategoryTextColor = (category) => {
    switch (category) {
      case 'Work & Career': return 'text-sky-700';
      case 'Sport & Health': return 'text-amber-700';
      case 'Personal Development': return 'text-emerald-700';
      default: return 'text-violet-700';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* LEFT COLUMN: Main Task Area */}
      <div className="flex-1 space-y-6">

        {/* Creation Form */}
        {defaultFilter !== 'Completed' && (
          <div className="bg-gradient-to-br from-white via-white to-sky-50/50 p-5 rounded-xl border border-sky-100">
            <h2 className="text-base font-semibold mb-4 text-slate-800 flex items-center gap-2">
              <LayoutList size={18} className="text-sky-600" /> Create New Task
            </h2>
            <GoalForm addGoal={addGoal} />
          </div>
        )}

        {/* Task List Panel */}
        <div className={`bg-white rounded-xl border border-sky-100 flex flex-col ${defaultFilter === 'Completed' ? 'h-[650px]' : 'h-[500px]'}`}>
          {/* Panel Header & Filters */}
          <div className="p-4 border-b border-sky-100 flex justify-between items-center bg-gradient-to-r from-sky-50/60 to-indigo-50/40 rounded-t-xl">
            <h2 className="text-base font-semibold text-slate-800">{listTitle}</h2>
            <div className="flex bg-sky-100/70 p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setFilter('All')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${filter === 'All' ? 'bg-white shadow-xs text-sky-900' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('Active')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${filter === 'Active' ? 'bg-white shadow-xs text-sky-900' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('Completed')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${filter === 'Completed' ? 'bg-white shadow-xs text-sky-900' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {filteredGoals.length > 0 ? (
              <div className="space-y-1">
                {filteredGoals.map((goal) => (
                  <div
                    key={goal._id}
                    className="group flex items-center justify-between p-3 hover:bg-sky-50/60 rounded-lg border border-transparent hover:border-sky-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleGoal(goal._id, !goal.completed)}
                        className="text-slate-400 hover:text-sky-600 transition-colors"
                      >
                        {goal.completed ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} />}
                      </button>
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${goal.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {goal.text}
                        </span>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className={`font-medium ${getCategoryTextColor(goal.category)}`}>
                            {goal.category}
                          </span>
                          {goal.endDate && (
                            <>
                              <span aria-hidden="true" className="text-slate-300">·</span>
                              <span className="text-slate-500 tabular-nums">
                                Due {new Date(goal.endDate).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteGoal(goal._id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-slate-900 font-medium mb-1">You're all caught up!</h3>
                <p className="text-sm text-slate-500 max-w-[260px]">
                  You don't have any {filter.toLowerCase()} tasks right now. Create a new goal above to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Widgets */}
      <div className="w-full lg:w-80 flex flex-col gap-6">

        {/* Productivity Widget */}
        <div className="bg-gradient-to-br from-amber-50/75 via-white to-orange-50/50 p-5 rounded-xl border border-amber-100">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Flame size={16} className="text-amber-500" /> Productivity Score
          </h3>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-bold text-slate-900 tabular-nums">{completionRate}%</span>
            <span className="text-sm text-slate-500 mb-1">completion</span>
          </div>
          <div className="w-full bg-amber-100/80 rounded-full h-2.5 mb-4">
            <div
              className="bg-amber-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-amber-100/80 pt-4 mt-2">
            <div className="bg-sky-50/80 rounded-lg p-3">
              <p className="text-xs text-sky-700 font-medium mb-0.5">Active</p>
              <p className="text-lg font-semibold text-slate-800 tabular-nums">{activeCount}</p>
            </div>
            <div className="bg-emerald-50/80 rounded-lg p-3">
              <p className="text-xs text-emerald-700 font-medium mb-0.5">Done</p>
              <p className="text-lg font-semibold text-slate-800 tabular-nums">{completedCount}</p>
            </div>
          </div>
        </div>

        {/* Mini Calendar/Upcoming Widget */}
        <div className="bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/50 p-5 rounded-xl border border-indigo-100 flex-1">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-indigo-500" /> Upcoming Deadlines
          </h3>
          <div className="space-y-3.5">
            {goals.filter(g => !g.completed && g.endDate).slice(0, 4).map(goal => (
              <div key={goal._id} className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] text-indigo-500 uppercase font-semibold leading-none">
                    {new Date(goal.endDate).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-sm font-bold text-indigo-800 leading-tight tabular-nums">
                    {new Date(goal.endDate).getDate()}
                  </span>
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                  <span className="text-sm font-medium text-slate-800 truncate">{goal.text}</span>
                  <span className={`text-xs truncate ${getCategoryTextColor(goal.category)}`}>{goal.category}</span>
                </div>
              </div>
            ))}
            {goals.filter(g => !g.completed).length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No upcoming deadlines.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TodayPage;