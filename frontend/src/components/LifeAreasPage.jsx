import { Briefcase, Heart, BookOpen, Coffee, Target, CheckCircle2 } from 'lucide-react';

const LifeAreasPage = ({ goals }) => {
  // Define the core areas of life matching our categories
  const areas = [
    { name: 'Work & Career', icon: Briefcase, theme: 'text-blue-600', bg: 'bg-blue-50', bar: 'bg-blue-500' },
    { name: 'Sport & Health', icon: Heart, theme: 'text-orange-600', bg: 'bg-orange-50', bar: 'bg-orange-500' },
    { name: 'Personal Development', icon: BookOpen, theme: 'text-green-600', bg: 'bg-green-50', bar: 'bg-green-500' },
    { name: 'Fun & Relaxation', icon: Coffee, theme: 'text-purple-600', bg: 'bg-purple-50', bar: 'bg-purple-500' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
           Life Areas
        </h2>
        <p className="text-gray-500 text-sm mt-1">Balance your goals across different aspects of your life.</p>
      </div>

      {/* Grid of Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {areas.map((area) => {
          const Icon = area.icon;
          const areaGoals = goals.filter(g => g.category === area.name);
          const completed = areaGoals.filter(g => g.completed).length;
          const total = areaGoals.length;
          const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

          return (
            <div key={area.name} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${area.bg} ${area.theme} flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{area.name}</h3>
                    <p className="text-sm text-gray-500">{total} Total Goals</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-800">{progress}%</span>
                </div>
              </div>

              {/* Card Body - Progress Bar */}
              <div className="p-6 bg-gray-50/50">
                <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <span>Progress</span>
                  <span>{completed} / {total} Completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                  <div className={`${area.bar} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
                </div>

                {/* Mini Task Preview */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Tasks</h4>
                  {areaGoals.filter(g => !g.completed).slice(0, 3).map(goal => (
                    <div key={goal._id} className="flex items-center gap-2 text-sm text-gray-700">
                      <Target size={14} className="text-gray-400" />
                      <span className="truncate">{goal.text}</span>
                    </div>
                  ))}
                  {areaGoals.filter(g => !g.completed).length === 0 && (
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-500" /> All caught up!
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LifeAreasPage;