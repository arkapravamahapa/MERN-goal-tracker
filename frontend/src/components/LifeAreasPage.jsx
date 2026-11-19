import { Briefcase, Heart, BookOpen, Coffee, Target, CheckCircle2, Compass } from 'lucide-react';

const LifeAreasPage = ({ goals }) => {
  const areas = [
    {
      name: 'Work & Career',
      icon: Briefcase,
      theme: 'text-sky-700',
      iconBg: 'bg-sky-100/80',
      cardBg: 'bg-gradient-to-br from-sky-50/70 via-white to-white border-sky-100',
      bodyBg: 'bg-sky-50/35',
      track: 'bg-sky-100',
      bar: 'bg-sky-400',
    },
    {
      name: 'Sport & Health',
      icon: Heart,
      theme: 'text-amber-700',
      iconBg: 'bg-amber-100/80',
      cardBg: 'bg-gradient-to-br from-amber-50/70 via-white to-white border-amber-100',
      bodyBg: 'bg-amber-50/35',
      track: 'bg-amber-100',
      bar: 'bg-amber-400',
    },
    {
      name: 'Personal Development',
      icon: BookOpen,
      theme: 'text-emerald-700',
      iconBg: 'bg-emerald-100/80',
      cardBg: 'bg-gradient-to-br from-emerald-50/70 via-white to-white border-emerald-100',
      bodyBg: 'bg-emerald-50/35',
      track: 'bg-emerald-100',
      bar: 'bg-emerald-400',
    },
    {
      name: 'Fun & Relaxation',
      icon: Coffee,
      theme: 'text-violet-700',
      iconBg: 'bg-violet-100/80',
      cardBg: 'bg-gradient-to-br from-violet-50/70 via-white to-white border-violet-100',
      bodyBg: 'bg-violet-50/35',
      track: 'bg-violet-100',
      bar: 'bg-violet-400',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">

      {/* Header */}
      <div className="border-b border-sky-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-teal-100/80 text-teal-600">
            <Compass size={20} />
          </span>
          Life Areas
        </h2>
        <p className="text-slate-500 text-sm mt-1">Balance your goals across different aspects of your life.</p>
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
            <div key={area.name} className={`rounded-xl border overflow-hidden transition-all ${area.cardBg}`}>
              {/* Card Header */}
              <div className="p-6 border-b border-slate-100/80 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${area.iconBg} ${area.theme} flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{area.name}</h3>
                    <p className="text-sm text-slate-500 tabular-nums">{total} Total Goals</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold tabular-nums ${area.theme}`}>{progress}%</span>
                </div>
              </div>

              {/* Card Body - Progress Bar */}
              <div className={`p-6 ${area.bodyBg}`}>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span>Progress</span>
                  <span className="tabular-nums">{completed} / {total} Completed</span>
                </div>
                <div className={`w-full ${area.track} rounded-full h-2.5 mb-6`}>
                  <div className={`${area.bar} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${progress}%` }}></div>
                </div>

                {/* Mini Task Preview */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-slate-500">Active Tasks</h4>
                  {areaGoals.filter(g => !g.completed).slice(0, 3).map(goal => (
                    <div key={goal._id} className="flex items-center gap-2 text-sm text-slate-700">
                      <Target size={14} className={area.theme} />
                      <span className="truncate">{goal.text}</span>
                    </div>
                  ))}
                  {areaGoals.filter(g => !g.completed).length === 0 && (
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500" /> All caught up!
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