import { useParams } from 'react-router-dom';
import { Star, CheckCircle2, Circle, Target, Briefcase } from 'lucide-react';

const FavoritesPage = ({ goals, toggleGoal }) => {
  const { id } = useParams();

  let pageTitle;
  let pageIcon;
  let iconBg;
  let filteredGoals;

  if (id === 'work') {
    pageTitle = 'Work & Career';
    pageIcon = <Briefcase size={20} className="text-sky-600" />;
    iconBg = 'bg-sky-100/80';
    filteredGoals = goals.filter(g => g.category === 'Work & Career');
  } else if (id === 'revenue') {
    pageTitle = 'Do 100K Revenue';
    pageIcon = <Target size={20} className="text-indigo-600" />;
    iconBg = 'bg-indigo-100/80';
    filteredGoals = goals.filter(g =>
      g.text.toLowerCase().includes('100k') ||
      g.text.toLowerCase().includes('revenue')
    );
  } else {
    pageTitle = 'Saved Favorite';
    pageIcon = <Star size={20} className="text-amber-500" />;
    iconBg = 'bg-amber-100/80';
    filteredGoals = [];
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">

      {/* Dynamic Header */}
      <div className="border-b border-sky-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <span className={`p-2 rounded-lg ${iconBg}`}>{pageIcon}</span>
          {pageTitle}
        </h2>
        <p className="text-slate-500 text-sm mt-1">A quick view of your pinned goals and categories.</p>
      </div>

      {/* Dynamic Filtered List */}
      <div className="bg-white rounded-xl border border-sky-100 overflow-hidden">
        {filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4">
              <Star size={32} />
            </div>
            <h3 className="text-slate-900 font-medium mb-1">No matches found</h3>
            <p className="text-sm text-slate-500 max-w-[300px]">
              You don't have any goals that match this favorite filter yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-sky-50">
            {filteredGoals.map((goal) => (
              <div key={goal._id} className="group flex items-center justify-between p-4 hover:bg-sky-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleGoal(goal._id, !goal.completed)}
                    className="text-slate-400 hover:text-sky-600 transition-colors focus:outline-none"
                  >
                    {goal.completed ? <CheckCircle2 size={22} className="text-emerald-500" /> : <Circle size={22} />}
                  </button>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {goal.text}
                    </span>
                    {goal.endDate && (
                      <span className="text-xs text-slate-500 mt-0.5 tabular-nums">
                        Due {new Date(goal.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;