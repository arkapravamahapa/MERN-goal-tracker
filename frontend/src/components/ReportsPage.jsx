import { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, CheckCircle, Clock } from 'lucide-react';

const ReportsPage = () => {
  const [goals, setGoals] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch data from both APIs simultaneously
    const fetchData = async () => {
      try {
        const [goalsRes, projectsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/goals/'),
          axios.get('http://localhost:5000/api/projects/')
        ]);
        setGoals(goalsRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchData();
  }, []);

  // Calculate Metrics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const completionRate = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

  // Calculate total timesheet hours
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
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Active Goals</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalGoals}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Goal Completion Rate</p>
            <h3 className="text-2xl font-bold text-gray-900">{completionRate}%</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Hours Logged</p>
            <h3 className="text-2xl font-bold text-gray-900">{Math.round(totalHoursLogged)}h</h3>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Database Analytics Overview</h3>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Overall Goal Progress</span>
            <span className="text-gray-500">{completedGoals} / {totalGoals}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportsPage;