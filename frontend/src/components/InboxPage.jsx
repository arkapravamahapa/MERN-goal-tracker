import { useState } from 'react';
import { Inbox as InboxIcon, Plus, Circle, CheckCircle2, Trash2, ArrowRight } from 'lucide-react';

const InboxPage = ({ goals, addGoal, toggleGoal, deleteGoal }) => {
  const [quickTask, setQuickTask] = useState('');

  // Filter only goals that are categorized as 'Inbox'
  const inboxTasks = goals.filter(g => g.category === 'Inbox');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickTask.trim()) return;
    
    // Create a simplified goal payload
    addGoal({
      text: quickTask,
      category: 'Inbox',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)) // Default to tomorrow
    });
    
    setQuickTask('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <InboxIcon className="text-blue-600" /> Inbox
        </h2>
        <p className="text-gray-500 text-sm mt-1">Quick capture for ideas and tasks before organizing them.</p>
      </div>

      {/* Quick Capture Input */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleQuickSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Plus size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="What's on your mind? Press Enter to save..." 
              value={quickTask}
              onChange={(e) => setQuickTask(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              autoFocus
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none"
            title="Save to Inbox"
          >
            <ArrowRight size={18} />
          </button>
        </form>
      </div>

      {/* Inbox List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {inboxTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
              <InboxIcon size={32} />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">Inbox Zero!</h3>
            <p className="text-sm text-gray-500">Your mind is clear. Use the bar above to capture new tasks.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {inboxTasks.map((task) => (
              <div key={task._id} className="group flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleGoal(task._id, !task.completed)} className="text-gray-400 hover:text-blue-600 transition-colors focus:outline-none">
                    {task.completed ? <CheckCircle2 size={22} className="text-green-500" /> : <Circle size={22} />}
                  </button>
                  <span className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                    {task.text}
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                    Needs Processing
                  </span>
                  <button 
                    onClick={() => deleteGoal(task._id)} 
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all focus:outline-none"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;