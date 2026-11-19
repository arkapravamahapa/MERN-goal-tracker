import { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, CheckCircle, Clock } from 'lucide-react';

const ReportsPage = () => {
  const [goals, setGoals] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goalsRes, projectsRes] = await Promise.all([
          axios.get('/api/goals/'),
          axios.get('/api/projects/')
        ]);
        setGoals(goalsRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchData();
  }, []);

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const completionRate = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    if (timeStr.includes(':')) {
      const [hours, mins] = timeStr.split(':');
      return (parseInt(hours || 0)) + (parseInt(mins || 0) / 60);
    }
    return parseFloat(timeStr) || 0;
  };

  const totalHoursLogged = projects.reduce((acc, proj) => {
    const rowHours = proj.hours.reduce((sum, h) => sum + parseTime(h), 0);
    return acc + rowHours;
  }, 0);

  return (
    <div className="space-y-6">

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-gradient-to-br from-sky-50/80 to-white p-6 rounded-xl border border-sky-100 flex items-center gap-4">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-full">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-sky-700">Total Active Goals</p>
            <h3 className="text-2xl font-bold text-slate-900 tabular-nums">{totalGoals}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/80 to-white p-6 rounded-xl border border-emerald-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-700">Goal Completion Rate</p>
            <h3 className="text-2xl font-bold text-slate-900 tabular-nums">{completionRate}%</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-50/80 to-white p-6 rounded-xl border border-violet-100 flex items-center gap-4">
          <div className="p-3 bg-violet-100 text-violet-600 rounded-full">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-violet-700">Total Hours Logged</p>
            <h3 className="text-2xl font-bold text-slate-900 tabular-nums">{Math.round(totalHoursLogged)}h</h3>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-white p-6 rounded-xl border border-sky-100">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Analytics Overview</h3>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-slate-700">Overall Goal Progress</span>
            <span className="text-slate-500 tabular-nums">{completedGoals} / {totalGoals}</span>
          </div>
          <div className="w-full bg-sky-100/80 rounded-full h-2.5">
            <div className="bg-sky-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportsPage;