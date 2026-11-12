import { Clock, Calendar as CalendarIcon, Circle, AlertCircle } from 'lucide-react';

const UpcomingPage = ({ goals, toggleGoal }) => {
  // 1. Filter out completed goals and goals without end dates
  const activeGoals = goals.filter(goal => !goal.completed && goal.endDate);

  // 2. Sort chronologically by endDate
  const sortedGoals = [...activeGoals].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  // 3. Group goals into "Overdue", "Next 7 Days", and "Later"
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const grouped = {
    overdue: [],
    thisWeek: [],
    later: []
  };

  sortedGoals.forEach(goal => {
    const endDate = new Date(goal.endDate);
    endDate.setHours(0, 0, 0, 0);

    if (endDate < today) {
      grouped.overdue.push(goal);
    } else if (endDate >= today && endDate <= nextWeek) {
      grouped.thisWeek.push(goal);
    } else {
      grouped.later.push(goal);
    }
  });

  const getCategoryTheme = (category) => {
    switch(category) {
      case 'Work & Career': return 'bg-blue-100 text-blue-700';
      case 'Sport & Health': return 'bg-orange-100 text-orange-700';
      case 'Personal Development': return 'bg-green-100 text-green-700';
      default: return 'bg-purple-100 text-purple-700';
    }
  };

  const renderGoalList = (list, emptyMessage) => {
    if (list.length === 0) return <p className="text-sm text-gray-400 py-2">{emptyMessage}</p>;
    
    return (
      <div className="space-y-2">
        {list.map(goal => (
          <div key={goal._id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-gray-300 transition-all group">
            <div className="flex items-center gap-3">
              <button onClick={() => toggleGoal(goal._id, !goal.completed)} className="text-gray-300 hover:text-blue-600 transition-colors">
                <Circle size={22} />
              </button>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">{goal.text}</span>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getCategoryTheme(goal.category)}`}>
                    {goal.category}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <CalendarIcon size={12} />
                    {new Date(goal.endDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="text-blue-600" /> Upcoming Deadlines
        </h2>
        <p className="text-gray-500 text-sm mt-1">Plan ahead and track your active database goals.</p>
      </div>

      {/* Overdue Section (Only shows if there are overdue tasks) */}
      {grouped.overdue.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-1">
            <AlertCircle size={16} /> Overdue
          </h3>
          {renderGoalList(grouped.overdue, "")}
        </section>
      )}

      {/* This Week Section */}
      <section>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Next 7 Days</h3>
        {renderGoalList(grouped.thisWeek, "No deadlines coming up this week.")}
      </section>

      {/* Later Section */}
      <section>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Later</h3>
        {renderGoalList(grouped.later, "No future goals scheduled.")}
      </section>

    </div>
  );
};

export default UpcomingPage;