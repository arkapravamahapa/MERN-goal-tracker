import { useParams } from 'react-router-dom';
import { Star, CheckCircle2, Circle, Target, Briefcase } from 'lucide-react';

const FavoritesPage = ({ goals, toggleGoal }) => {
  // Extract the dynamic ':id' from the URL (e.g., 'work' or 'revenue')
  const { id } = useParams();

  // Smart filtering based on the URL parameter
  let pageTitle;
  let pageIcon;
  let filteredGoals;

  if (id === 'work') {
    pageTitle = 'Work & Career (Favorite)';
    pageIcon = <Briefcase className="text-blue-600" />;
    filteredGoals = goals.filter(g => g.category === 'Work & Career');
  } else if (id === 'revenue') {
    pageTitle = 'Do 100K Revenue (Favorite)';
    pageIcon = <Target className="text-blue-600" />;
    // Find goals that contain "100k" or "revenue" in the text, ignoring case
    filteredGoals = goals.filter(g => 
      g.text.toLowerCase().includes('100k') || 
      g.text.toLowerCase().includes('revenue')
    );
  } else {
    pageTitle = 'Saved Favorite';
    pageIcon = <Star className="text-yellow-500" />;
    filteredGoals = [];
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Dynamic Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {pageIcon} {pageTitle}
        </h2>
        <p className="text-gray-500 text-sm mt-1">A quick view of your pinned goals and categories.</p>
      </div>

      {/* Dynamic Filtered List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
              <Star size={32} />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">No matches found</h3>
            <p className="text-sm text-gray-500 max-w-[300px]">
              You don't have any goals in your database that match this favorite filter yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredGoals.map((goal) => (
              <div key={goal._id} className="group flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleGoal(goal._id, !goal.completed)} className="text-gray-400 hover:text-blue-600 transition-colors focus:outline-none">
                    {goal.completed ? <CheckCircle2 size={22} className="text-green-500" /> : <Circle size={22} />}
                  </button>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {goal.text}
                    </span>
                    {goal.endDate && (
                      <span className="text-xs text-gray-500 mt-0.5">
                        Due: {new Date(goal.endDate).toLocaleDateString()}
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