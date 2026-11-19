import { Clock, Calendar as CalendarIcon, Circle, AlertCircle } from 'lucide-react';

const UpcomingPage = ({ goals, toggleGoal }) => {
  const activeGoals = goals.filter(goal => !goal.completed && goal.endDate);
  const sortedGoals = [...activeGoals].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

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

  const getCategoryTextColor = (category) => {
    switch (category) {
      case 'Work & Career': return 'text-sky-700';
      case 'Sport & Health': return 'text-amber-700';
      case 'Personal Development': return 'text-emerald-700';
      default: return 'text-violet-700';
    }
  };

  const renderGoalList = (list, emptyMessage) => {
    if (list.length === 0) return <p className="text-sm text-slate-500 py-2">{emptyMessage}</p>;

    return (
      <div className="space-y-2">
        {list.map(goal => (
          <div
            key={goal._id}
            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-lg hover:border-sky-200 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleGoal(goal._id, !goal.completed)}
                className="text-slate-300 hover:text-sky-600 transition-colors"
              >
                <Circle size={22} />
              </button>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">{goal.text}</span>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className={`font-medium ${getCategoryTextColor(goal.category)}`}>
                    {goal.category}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500 flex items-center gap-1 tabular-nums">
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">

      {/* Header */}
      <div className="border-b border-sky-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-amber-100/80 text-amber-600">
            <Clock size={20} />
          </span>
          Upcoming Deadlines
        </h2>
        <p className="text-slate-500 text-sm mt-1">Plan ahead and track your active goals by timeline.</p>
      </div>

      {/* Overdue Section */}
      {grouped.overdue.length > 0 && (
        <section className="bg-rose-50/60 border border-rose-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-rose-700 mb-3 flex items-center gap-1.5">
            <AlertCircle size={16} /> Overdue
          </h3>
          {renderGoalList(grouped.overdue, '')}
        </section>
      )}

      {/* This Week Section */}
      <section className="bg-amber-50/50 border border-amber-100 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-amber-800 mb-3">Next 7 Days</h3>
        {renderGoalList(grouped.thisWeek, 'No deadlines coming up this week.')}
      </section>

      {/* Later Section */}
      <section className="bg-sky-50/50 border border-sky-100 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-sky-800 mb-3">Later</h3>
        {renderGoalList(grouped.later, 'No future goals scheduled.')}
      </section>

    </div>
  );
};

export default UpcomingPage;