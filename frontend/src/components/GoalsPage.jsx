import { useState } from 'react';
import { Target, Search, CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react';

const GoalsPage = ({ goals, toggleGoal, deleteGoal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter goals based on the search input
  const filteredGoals = goals.filter(goal => 
    goal.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryBadge = (category) => {
    switch(category) {
      case 'Work & Career': return 'bg-blue-100 text-blue-700';
      case 'Sport & Health': return 'bg-orange-100 text-orange-700';
      case 'Personal Development': return 'bg-green-100 text-green-700';
      default: return 'bg-purple-100 text-purple-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="text-blue-600" /> Goals Master List
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage and search your entire database of objectives.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search goals or categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Goal Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGoals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No goals match your search.
                  </td>
                </tr>
              ) : (
                filteredGoals.map((goal) => (
                  <tr key={goal._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <button onClick={() => toggleGoal(goal._id, !goal.completed)} className="text-gray-400 hover:text-blue-600 transition-colors focus:outline-none">
                        {goal.completed ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {goal.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getCategoryBadge(goal.category)}`}>
                        {goal.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={14} />
                        {goal.startDate ? new Date(goal.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'} 
                        {' - '} 
                        {goal.endDate ? new Date(goal.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteGoal(goal._id)} 
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all focus:outline-none"
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