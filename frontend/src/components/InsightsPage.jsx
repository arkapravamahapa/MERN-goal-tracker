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
          axios.get('http://localhost:5000/api/goals/'),
          axios.get('http://localhost:5000/api/projects/'),
          axios.get('http://localhost:5000/api/habits/')
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
    return <div className="flex items-center justify-center h-full text-gray-500">Loading analytics...</div>;
  }

  // --- Calculations ---
  
  // Goals Math
  const totalGoals = data.goals.length;
  const completedGoals = data.goals.filter(g => g.completed).length;
  const completionRate = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

  // Timesheet Math
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

  // Habits Math
  const activeHabits = data.habits.length;
  const topHabit = [...data.habits].sort((a, b) => b.streak - a.streak)[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <PieChart className="text-blue-600" /> Workspace Insights
        </h2>
        <p className="text-gray-500 text-sm mt-1">High-level analytics across all your tasks, time, and habits.</p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <Target size={18} className="text-blue-500" />
            <h3 className="text-sm font-medium">Total Actions</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalGoals}</p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <CheckCircle2 size={18} className="text-green-500" />
            <h3 className="text-sm font-medium">Completion Rate</h3>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <Clock size={18} className="text-purple-500" />
            <h3 className="text-sm font-medium">Time Tracked</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{Math.round(totalHoursLogged)}<span className="text-lg text-gray-500 font-medium">h</span></p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <Flame size={18} className="text-orange-500" />
            <h3 className="text-sm font-medium">Best Streak</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{topHabit ? topHabit.streak : 0}<span className="text-lg text-gray-500 font-medium"> days</span></p>
        </div>

      </div>

      {/* Deep Dive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Goal Progress Bar */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-blue-600" /> Project Execution
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Overall Database Completion</span>
                <span className="text-gray-500 font-medium">{completedGoals} / {totalGoals} Tasks</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-700">{totalGoals - completedGoals}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Active Habits</p>
                <p className="text-2xl font-bold text-gray-700">{activeHabits}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Habit Spotlight */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-6">Top Performer</h3>
          {topHabit && topHabit.streak > 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-48 bg-orange-50/50 rounded-lg border border-orange-100 p-4">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-3">
                <Flame size={32} />
              </div>
              <h4 className="font-bold text-gray-900">{topHabit.name}</h4>
              <p className="text-sm text-orange-600 font-medium mt-1">Currently on a {topHabit.streak}-day streak!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-48 bg-gray-50 rounded-lg border border-gray-100 p-4">
              <p className="text-sm text-gray-500">No active streaks yet. Head to the Habits tab to start checking in!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InsightsPage;