import { useState } from 'react';
import { ChevronDown, CheckCircle2, CornerDownRight, Plus, Check, X } from 'lucide-react';
import axios from 'axios';

const TimelineChart = ({ goals = [] }) => {
  const [localGoals, setLocalGoals] = useState(null);
  const [addingForGoalId, setAddingForGoalId] = useState(null);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

  const categories = ['Work & Career', 'Sport & Health', 'Personal Development', 'Fun & Relaxation', 'Inbox'];

  const effectiveGoals = localGoals || goals;
  const groupedGoals = categories.reduce((acc, cat) => {
    acc[cat] = effectiveGoals.filter((g) => g.category === cat);
    return acc;
  }, {});

  const currentYear = new Date().getFullYear();
  const chartStartDate = new Date(`${currentYear}-04-01`);
  const pixelsPerDay = 96 / 30;

  const getBarStyles = (startDate, endDate, subtaskIndex = null) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let offsetDays = (start - chartStartDate) / (1000 * 60 * 60 * 24);
    let durationDays = (end - start) / (1000 * 60 * 60 * 24);

    if (subtaskIndex !== null) {
      offsetDays += (subtaskIndex * 4);
      durationDays = Math.max(3, durationDays / 2);
    }

    return {
      left: `${Math.max(0, offsetDays * pixelsPerDay)}px`,
      width: `${Math.max(40, durationDays * pixelsPerDay)}px`,
    };
  };

  const getTheme = (category, isSubtask = false) => {
    if (isSubtask) return 'bg-white border-sky-200 text-slate-700 hover:bg-sky-50/50';

    switch (category) {
      case 'Work & Career': return 'bg-sky-100 border-sky-200 text-sky-900';
      case 'Sport & Health': return 'bg-amber-100 border-amber-200 text-amber-900';
      case 'Personal Development': return 'bg-emerald-100 border-emerald-200 text-emerald-900';
      case 'Fun & Relaxation': return 'bg-violet-100 border-violet-200 text-violet-900';
      default: return 'bg-slate-100 border-slate-200 text-slate-800';
    }
  };

  const getCategoryHeaderBg = (category) => {
    switch (category) {
      case 'Work & Career': return 'bg-sky-50/70 text-sky-900';
      case 'Sport & Health': return 'bg-amber-50/70 text-amber-900';
      case 'Personal Development': return 'bg-emerald-50/70 text-emerald-900';
      case 'Fun & Relaxation': return 'bg-violet-50/70 text-violet-900';
      default: return 'bg-slate-50/80 text-slate-800';
    }
  };

  const submitSubtask = async (goal) => {
    const title = subtaskTitle.trim();
    if (!title) {
      setAddingForGoalId(null);
      return;
    }

    const newSubtask = { title, completed: false, duration: '1w' };
    const updatedSubtasks = [...(goal.subtasks || []), newSubtask];

    try {
      const response = await axios.put(`/api/goals/${goal._id}`, {
        subtasks: updatedSubtasks
      });
      setLocalGoals((prev) => {
        const base = prev || goals;
        return base.map(g => g._id === goal._id ? response.data : g);
      });
    } catch (error) {
      console.error('Error adding subtask:', error);
    } finally {
      setSubtaskTitle('');
      setAddingForGoalId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-sky-100 overflow-hidden mt-2 flex flex-col h-[650px]">

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-sky-100 bg-gradient-to-r from-sky-50/60 via-white to-violet-50/50">
        <h2 className="text-xl font-semibold text-slate-800">Timeline</h2>
        <div className="flex bg-sky-100/70 p-1 rounded-lg text-sm text-slate-600 font-medium">
          <button className="px-3 py-1 bg-white shadow-xs rounded-md text-sky-900">Months</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-x-auto overflow-y-auto relative custom-scrollbar">
        <div className="min-w-max flex flex-col">

          {/* Top Row: Month Columns */}
          <div className="flex h-10 border-b border-sky-100 sticky top-0 bg-white z-20">
            <div className="w-80 shrink-0 border-r border-sky-100 px-4 flex items-center text-xs font-semibold text-sky-700 bg-sky-50/60 sticky left-0 z-30">
              Goals
            </div>
            <div className="flex bg-sky-50/40">
              {months.map((month) => (
                <div key={month} className="w-24 shrink-0 flex items-center justify-center text-xs font-medium text-slate-500 border-r border-sky-100/70">
                  {month}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col pb-12">
            {categories.map((category) => {
              const catGoals = groupedGoals[category];
              if (!catGoals || catGoals.length === 0) return null;

              return (
                <div key={category} className="flex flex-col">

                  {/* Category Header */}
                  <div className="flex border-b border-sky-100/80 bg-sky-50/20">
                    <div className={`w-80 shrink-0 border-r border-sky-100 px-4 py-2 flex justify-between items-center text-sm font-semibold sticky left-0 z-10 ${getCategoryHeaderBg(category)}`}>
                      <span>{category}</span>
                      <ChevronDown size={16} className="opacity-60" />
                    </div>
                    <div className="flex-1 relative">
                      {months.map((_, i) => (
                        <div key={i} className="absolute top-0 bottom-0 w-24 border-r border-sky-100/60 pointer-events-none" style={{ left: `${i * 96}px` }}></div>
                      ))}
                    </div>
                  </div>

                  {/* Parent Goals & Nested Subtasks */}
                  {catGoals.map((goal) => (
                    <div key={goal._id}>

                      {/* PARENT GOAL ROW */}
                      <div className="flex h-10 border-b border-slate-100 hover:bg-sky-50/40 transition-colors group">
                        <div className="w-80 shrink-0 border-r border-sky-100 px-4 py-2 pl-6 flex items-center justify-between text-sm bg-white sticky left-0 z-10 group-hover:bg-sky-50/40">
                          <div className="flex items-center gap-2 overflow-hidden pr-2">
                            <CheckCircle2 size={16} className={goal.completed ? 'text-emerald-500 shrink-0' : 'text-slate-300 shrink-0'} />
                            <span className={goal.completed ? 'line-through text-slate-400 truncate' : 'text-slate-800 font-medium truncate'}>
                              {goal.text}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setAddingForGoalId(goal._id);
                              setSubtaskTitle('');
                            }}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-sky-600 transition-opacity"
                            title="Add sub-task"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Parent Gantt Bar */}
                        <div className="flex-1 relative min-w-[1056px]">
                          {months.map((_, i) => (
                            <div key={i} className="absolute top-0 bottom-0 w-24 border-r border-sky-50 pointer-events-none" style={{ left: `${i * 96}px` }}></div>
                          ))}
                          {goal.startDate && goal.endDate && (
                            <div className="absolute top-1.5 bottom-1.5">
                              <div
                                className={`h-full absolute rounded-full flex items-center px-3 border transition-all ${getTheme(goal.category)}`}
                                style={getBarStyles(goal.startDate, goal.endDate)}
                              >
                                <span className="text-xs font-semibold truncate">{goal.text}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* INLINE ADD SUBTASK ROW */}
                      {addingForGoalId === goal._id && (
                        <div className="flex h-10 border-b border-sky-100 bg-sky-50/60">
                          <div className="w-80 shrink-0 border-r border-sky-100 px-4 py-1 pl-10 flex items-center gap-1.5 bg-sky-50/60 sticky left-0 z-10">
                            <input
                              type="text"
                              value={subtaskTitle}
                              onChange={(e) => setSubtaskTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') submitSubtask(goal);
                                if (e.key === 'Escape') setAddingForGoalId(null);
                              }}
                              placeholder="Sub-task title..."
                              className="flex-1 text-xs bg-white border border-sky-200 rounded px-2 py-1 outline-none focus:border-sky-400"
                              autoFocus
                            />
                            <button
                              onClick={() => submitSubtask(goal)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Save sub-task"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setAddingForGoalId(null)}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="flex-1 min-w-[1056px]" />
                        </div>
                      )}

                      {/* CHILD SUBTASK ROWS */}
                      {goal.subtasks && goal.subtasks.map((subtask, index) => (
                        <div key={index} className="flex h-10 border-b border-slate-50 hover:bg-sky-50/30 transition-colors group">
                          <div className="w-80 shrink-0 border-r border-sky-100 px-4 py-2 pl-10 flex items-center gap-2 text-sm bg-sky-50/20 sticky left-0 z-10 group-hover:bg-sky-50/30">
                            <CornerDownRight size={14} className="text-sky-400 shrink-0" />
                            <span className="text-slate-600 truncate text-xs">{subtask.title}</span>
                          </div>

                          {/* Subtask Gantt Bar */}
                          <div className="flex-1 relative min-w-[1056px] bg-sky-50/15 group-hover:bg-sky-50/30 transition-colors">
                            {months.map((_, i) => (
                              <div key={i} className="absolute top-0 bottom-0 w-24 border-r border-sky-50 pointer-events-none" style={{ left: `${i * 96}px` }}></div>
                            ))}
                            {goal.startDate && goal.endDate && (
                              <div className="absolute top-2 bottom-2">
                                <div
                                  className={`h-full absolute rounded flex items-center px-2 border transition-all ${getTheme(goal.category, true)}`}
                                  style={getBarStyles(goal.startDate, goal.endDate, index)}
                                >
                                  <span className="text-[10px] font-medium truncate">{subtask.title}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineChart;