import { useState } from 'react';
import { Inbox as InboxIcon, Plus, Circle, CheckCircle2, Trash2, ArrowRight } from 'lucide-react';

const InboxPage = ({ goals, addGoal, toggleGoal, deleteGoal }) => {
  const [quickTask, setQuickTask] = useState('');

  const inboxTasks = goals.filter(g => g.category === 'Inbox');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickTask.trim()) return;

    addGoal({
      text: quickTask.trim(),
      category: 'Inbox',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1))
    });

    setQuickTask('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">

      {/* Header */}
      <div className="border-b border-sky-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-sky-100/80 text-sky-600">
            <InboxIcon size={20} />
          </span>
          Inbox
        </h2>
        <p className="text-slate-500 text-sm mt-1">Quick capture for ideas and tasks before organizing them.</p>
      </div>

      {/* Quick Capture Input */}
      <div className="bg-gradient-to-r from-sky-50/70 via-white to-indigo-50/50 p-4 rounded-xl border border-sky-100">
        <form onSubmit={handleQuickSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Plus size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-500/70" />
            <input
              type="text"
              placeholder="What's on your mind? Press Enter to save..."
              value={quickTask}
              onChange={(e) => setQuickTask(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-sky-200/80 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="bg-sky-600 text-white p-3 rounded-lg hover:bg-sky-700 transition-colors focus:outline-none"
            title="Save to Inbox"
          >
            <ArrowRight size={18} />
          </button>
        </form>
      </div>

      {/* Inbox List */}
      <div className="bg-white rounded-xl border border-sky-100 overflow-hidden">
        {inboxTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mb-4">
              <InboxIcon size={32} />
            </div>
            <h3 className="text-slate-900 font-medium mb-1">Inbox Zero!</h3>
            <p className="text-sm text-slate-500">Your mind is clear. Use the bar above to capture new tasks.</p>
          </div>
        ) : (
          <div className="divide-y divide-sky-50">
            {inboxTasks.map((task) => (
              <div key={task._id} className="group flex items-center justify-between p-4 hover:bg-sky-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleGoal(task._id, !task.completed)}
                    className="text-slate-400 hover:text-sky-600 transition-colors focus:outline-none"
                  >
                    {task.completed ? <CheckCircle2 size={22} className="text-emerald-500" /> : <Circle size={22} />}
                  </button>
                  <span className={`text-sm font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {task.text}
                  </span>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium text-sky-700">
                    Needs processing
                  </span>
                  <button
                    onClick={() => deleteGoal(task._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all focus:outline-none"
                    title="Delete item"
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