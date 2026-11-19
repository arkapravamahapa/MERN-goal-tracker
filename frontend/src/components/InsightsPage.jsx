import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Target, CheckCircle2, Clock, Flame, TrendingUp } from 'lucide-react';

const InsightsPage = () => {
  const [data, setData] = useState({
    goals: [],
    projects: [],
    habits: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [goalsRes, projectsRes, habitsRes] = await Promise.all([
          axios.get('/api/goals/'),
          axios.get('/api/projects/'),
          axios.get('/api/habits/')
        ]);

        setData({
          goals: goalsRes.data,
          projects: projectsRes.data,
          habits: habitsRes.data
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching insights data:', error);
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full text-slate-500">Loading analytics...</div>;
  }

  const totalGoals = data.goals.length;
  const completedGoals = data.goals.filter(g => g.completed).length;
  const completionRate = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    if (timeStr.includes(':')) {
      const [hours, mins] = timeStr.split(':');
      return (parseInt(hours || 0)) + (parseInt(mins || 0) / 60);
    }
    return parseFloat(timeStr) || 0;
  };

  const totalHoursLogged = data.projects.reduce((acc, proj) => {
    const rowHours = proj.hours.reduce((sum, h) => sum + parseTime(h), 0);
    return acc + rowHours;
  }, 0);

  const activeHabits = data.habits.length;
  const topHabit = [...data.habits].sort((a, b) => b.streak - a.streak)[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">

      {/* Header */}
      <div className="border-b border-sky-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-indigo-100/80 text-indigo-600">
            <PieChart size={20} />
          </span>
          Workspace Insights
        </h2>
        <p className="text-slate-500 text-sm mt-1">High-level analytics across all your tasks, time, and habits.</p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-gradient-to-br from-sky-50/80 to-white p-5 rounded-xl border border-sky-100">
          <div className="flex items-center gap-2.5 mb-2 text-sky-700">
            <Target size={18} className="text-sky-600" />
            <h3 className="text-sm font-medium">Total Actions</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 tabular-nums">{totalGoals}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/80 to-white p-5 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2.5 mb-2 text-emerald-700">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <h3 className="text-sm font-medium">Completion Rate</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 tabular-nums">{completionRate}%</p>
        </div>

        <div className="bg-gradient-to-br from-violet-50/80 to-white p-5 rounded-xl border border-violet-100">
          <div className="flex items-center gap-2.5 mb-2 text-violet-700">
            <Clock size={18} className="text-violet-600" />
            <h3 className="text-sm font-medium">Time Tracked</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 tabular-nums">
            {Math.round(totalHoursLogged)}<span className="text-lg text-slate-500 font-medium">h</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50/80 to-white p-5 rounded-xl border border-amber-100">
          <div className="flex items-center gap-2.5 mb-2 text-amber-700">
            <Flame size={18} className="text-amber-500" />
            <h3 className="text-sm font-medium">Best Streak</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 tabular-nums">
            {topHabit ? topHabit.streak : 0}<span className="text-lg text-slate-500 font-medium"> days</span>
          </p>
        </div>

      </div>

      {/* Deep Dive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Goal Progress Bar */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-sky-100">
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-sky-600" /> Project Execution
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Overall Completion</span>
                <span className="text-slate-500 font-medium tabular-nums">{completedGoals} / {totalGoals} Tasks</span>
              </div>
              <div className="w-full bg-sky-100/80 rounded-full h-3">
                <div
                  className="bg-sky-500 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-sky-50">
              <div className="bg-sky-50/70 p-4 rounded-lg border border-sky-100/70">
                <p className="text-xs text-sky-700 font-semibold mb-1">Pending Tasks</p>
                <p className="text-2xl font-bold text-slate-800 tabular-nums">{totalGoals - completedGoals}</p>
              </div>
              <div className="bg-emerald-50/70 p-4 rounded-lg border border-emerald-100/70">
                <p className="text-xs text-emerald-700 font-semibold mb-1">Active Habits</p>
                <p className="text-2xl font-bold text-slate-800 tabular-nums">{activeHabits}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Habit Spotlight */}
        <div className="bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 p-6 rounded-xl border border-amber-100">
          <h3 className="text-base font-semibold text-slate-800 mb-6">Top Performer</h3>
          {topHabit && topHabit.streak > 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-48 bg-white/80 rounded-xl border border-amber-100 p-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-3">
                <Flame size={32} />
              </div>
              <h4 className="font-bold text-slate-900">{topHabit.name}</h4>
              <p className="text-sm text-amber-700 font-medium mt-1 tabular-nums">
                Currently on a {topHabit.streak}-day streak!
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-48 bg-white/70 rounded-xl border border-amber-100 p-4">
              <p className="text-sm text-slate-500">No active streaks yet. Head to the Habits tab to start checking in!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InsightsPage;