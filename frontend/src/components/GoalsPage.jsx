import { useState } from 'react';
import { Target, Search, CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react';

const GoalsPage = ({ goals, toggleGoal, deleteGoal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGoals = goals.filter(goal =>
    goal.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Work & Career': return 'text-sky-700';
      case 'Sport & Health': return 'text-amber-700';
      case 'Personal Development': return 'text-emerald-700';
      default: return 'text-violet-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-rose-100/80 text-rose-600">
              <Target size={20} />
            </span>
            Goals Master List
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage and search your entire collection of objectives.</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500/70" />
          <input
            type="text"
            placeholder="Search goals or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-sky-50/40 border border-sky-200/80 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-sky-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-50/60 border-b border-sky-100 text-xs text-sky-900/70 font-semibold">
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Goal Name</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Timeline</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {filteredGoals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No goals match your search.
                  </td>
                </tr>
              ) : (
                filteredGoals.map((goal) => (
                  <tr key={goal._id} className="hover:bg-sky-50/40 transition-colors group">
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => toggleGoal(goal._id, !goal.completed)}
                        className="text-slate-400 hover:text-sky-600 transition-colors focus:outline-none"
                      >
                        {goal.completed ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} />}
                      </button>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`text-sm font-medium ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {goal.text}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-medium ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 tabular-nums">
                        <Calendar size={14} className="text-sky-400" />
                        {goal.startDate ? new Date(goal.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                        {' - '}
                        {goal.endDate ? new Date(goal.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => deleteGoal(goal._id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all focus:outline-none"
                        title="Delete Goal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;