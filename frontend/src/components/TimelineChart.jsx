import { useState } from 'react';
import { ChevronDown, CheckCircle2, CornerDownRight, Plus } from 'lucide-react';
import axios from 'axios';

const TimelineChart = ({ goals = [] }) => {
  const [localGoals, setLocalGoals] = useState(null); // null means not overridden
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

  // Math Engine: Includes cascading waterfall logic for subtasks
  const getBarStyles = (startDate, endDate, subtaskIndex = null) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let offsetDays = (start - chartStartDate) / (1000 * 60 * 60 * 24);
    let durationDays = (end - start) / (1000 * 60 * 60 * 24);

    // Create the cascading waterfall effect for nested subtasks
    if (subtaskIndex !== null) {
      offsetDays += (subtaskIndex * 4); // Shift right by 4 days per subtask
      durationDays = Math.max(3, durationDays / 2); // Make the subtask bar shorter than the parent
    }

    return {
      left: `${Math.max(0, offsetDays * pixelsPerDay)}px`,
      width: `${Math.max(40, durationDays * pixelsPerDay)}px`, 
    };
  };

  const getTheme = (category, isSubtask = false) => {
    if (isSubtask) return 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'; // Subtasks are neutral

    switch(category) {
      case 'Work & Career': return 'bg-blue-100 border-blue-200 text-blue-900';
      case 'Sport & Health': return 'bg-orange-100 border-orange-200 text-orange-900';
      case 'Personal Development': return 'bg-green-100 border-green-200 text-green-900';
      case 'Fun & Relaxation': return 'bg-purple-100 border-purple-200 text-purple-900';
      default: return 'bg-gray-100 border-gray-200 text-gray-900';
    }
  };

  // Add a subtask directly to MongoDB
  const handleAddSubtask = async (goal) => {
    const title = window.prompt(`Add a sub-task to "${goal.text}":`);
    if (!title) return;

    const newSubtask = { title, completed: false, duration: '1w' };
    const updatedSubtasks = [...(goal.subtasks || []), newSubtask];

    try {
      const response = await axios.put(`http://localhost:5000/api/goals/${goal._id}`, {
        subtasks: updatedSubtasks
      });
      // Update UI instantly
      setLocalGoals((prev) => {
        const base = prev || goals;
        return base.map(g => g._id === goal._id ? response.data : g);
      });
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-2 flex flex-col h-[650px]">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-semibold text-gray-800">Timeline</h2>
        <div className="flex bg-gray-100 p-1 rounded-md text-sm text-gray-600 font-medium">
          <button className="px-3 py-1 bg-white shadow-sm rounded-md text-gray-900">Months</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-x-auto overflow-y-auto relative custom-scrollbar">
        <div className="min-w-max flex flex-col">
          
          {/* Top Row: Month Columns */}
          <div className="flex h-10 border-b border-gray-200 sticky top-0 bg-white z-20">
            <div className="w-80 shrink-0 border-r border-gray-200 px-4 flex items-center text-xs font-semibold text-gray-400 uppercase bg-white sticky left-0 z-30">
              Goals
            </div>
            <div className="flex bg-gray-50/50">
              {months.map((month) => (
                <div key={month} className="w-24 shrink-0 flex items-center justify-center text-xs font-medium text-gray-400 border-r border-gray-100">
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
                  <div className="flex border-b border-gray-100 bg-gray-50/30">
                    <div className="w-80 shrink-0 border-r border-gray-200 px-4 py-2 flex justify-between items-center text-sm font-medium text-gray-700 bg-white sticky left-0 z-10">
                      <span>{category}</span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                    <div className="flex-1 relative">
                      {months.map((_, i) => (
                        <div key={i} className="absolute top-0 bottom-0 w-24 border-r border-gray-100 pointer-events-none" style={{ left: `${i * 96}px` }}></div>
                      ))}
                    </div>
                  </div>

                  {/* Parent Goals & Nested Subtasks */}
                  {catGoals.map((goal) => (
                    <div key={goal._id}>
                      
                      {/* PARENT GOAL ROW */}
                      <div className="flex h-10 border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                        <div className="w-80 shrink-0 border-r border-gray-200 px-4 py-2 pl-6 flex items-center justify-between text-sm bg-white sticky left-0 z-10 group-hover:bg-gray-50">
                          <div className="flex items-center gap-2 overflow-hidden pr-2">
                            <CheckCircle2 size={16} className={goal.completed ? "text-green-500 shrink-0" : "text-gray-300 shrink-0"} />
                            <span className={goal.completed ? "line-through text-gray-400 truncate" : "text-gray-800 font-medium truncate"}>
                              {goal.text}
                            </span>
                          </div>
                          <button onClick={() => handleAddSubtask(goal)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-opacity">
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        {/* Parent Gantt Bar */}
                        <div className="flex-1 relative min-w-[1056px]">
                          {months.map((_, i) => (
                            <div key={i} className="absolute top-0 bottom-0 w-24 border-r border-gray-100 pointer-events-none" style={{ left: `${i * 96}px` }}></div>
                          ))}
                          {goal.startDate && goal.endDate && (
                            <div className="absolute top-1.5 bottom-1.5">
                              <div 
                                className={`h-full absolute rounded-full flex items-center px-3 border shadow-sm transition-all ${getTheme(goal.category)}`}
                                style={getBarStyles(goal.startDate, goal.endDate)}
                              >
                                <span className="text-xs font-semibold truncate">{goal.text}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CHILD SUBTASK ROWS */}
                      {goal.subtasks && goal.subtasks.map((subtask, index) => (
                        <div key={index} className="flex h-10 border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                          <div className="w-80 shrink-0 border-r border-gray-200 px-4 py-2 pl-10 flex items-center gap-2 text-sm bg-gray-50/30 sticky left-0 z-10 group-hover:bg-gray-50">
                            <CornerDownRight size={14} className="text-gray-400 shrink-0" />
                            <span className="text-gray-600 truncate text-xs">{subtask.title}</span>
                          </div>
                          
                          {/* Subtask Gantt Bar (Cascading) */}
                          <div className="flex-1 relative min-w-[1056px] bg-gray-50/30 group-hover:bg-gray-50 transition-colors">
                            {months.map((_, i) => (
                              <div key={i} className="absolute top-0 bottom-0 w-24 border-r border-gray-100 pointer-events-none" style={{ left: `${i * 96}px` }}></div>
                            ))}
                            {goal.startDate && goal.endDate && (
                              <div className="absolute top-2 bottom-2">
                                <div 
                                  className={`h-full absolute rounded flex items-center px-2 border shadow-sm transition-all ${getTheme(goal.category, true)}`}
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