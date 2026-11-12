import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects/';

const TimesheetGrid = () => {
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(API_URL);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const addNewRow = async () => {
    try {
      const response = await axios.post(API_URL, { name: 'New Project', color: 'bg-blue-500' });
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error('Error adding project row:', error);
    }
  };

  const handleInputChange = (projectId, dayIndex, value) => {
    // Only allow numbers and basic time formats
    if (!/^[0-9:]*$/.test(value)) return;
    
    const updatedProjects = projects.map((proj) => {
      if (proj._id === projectId) {
        const newHours = [...proj.hours];
        newHours[dayIndex] = value;
        return { ...proj, hours: newHours };
      }
      return proj;
    });
    setProjects(updatedProjects);
  };

  const saveToDatabase = async (projectId) => {
    const projectToUpdate = projects.find((p) => p._id === projectId);
    try {
      await axios.put(API_URL + projectId, { hours: projectToUpdate.hours });
    } catch (error) {
      console.error('Error saving hours:', error);
    }
  };

  // --- NEW MATH FUNCTIONS ---

  // Helper to convert time string (e.g., "4:30" or "4") to a decimal number
  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    if (timeStr.includes(':')) {
      const [hours, mins] = timeStr.split(':');
      return (parseInt(hours || 0)) + (parseInt(mins || 0) / 60);
    }
    return parseFloat(timeStr) || 0;
  };

  // Helper to convert decimal back to time string (e.g., 4.5 -> "4:30")
  const formatTime = (decimal) => {
    if (decimal === 0) return '0:00';
    const hours = Math.floor(decimal);
    const mins = Math.round((decimal - hours) * 60);
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  // Calculate total for a single row
  const getRowTotal = (hoursArray) => {
    const totalDec = hoursArray.reduce((sum, val) => sum + parseTime(val), 0);
    return formatTime(totalDec);
  };

  // Calculate total for a specific column (day)
  const getColTotal = (dayIndex) => {
    const totalDec = projects.reduce((sum, proj) => sum + parseTime(proj.hours[dayIndex]), 0);
    return formatTime(totalDec);
  };

  // Calculate grand total
  const getGrandTotal = () => {
    let grandDec = 0;
    projects.forEach(proj => {
      proj.hours.forEach(val => grandDec += parseTime(val));
    });
    return formatTime(grandDec);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-xl font-normal text-gray-700">Weekly Timesheet</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-400 border-b border-gray-200 text-xs font-medium">
            <tr>
              <th className="px-4 py-3 w-48 font-normal">Projects</th>
              {days.map((day) => (
                <th key={day} className="px-2 py-3 text-center font-normal w-24">{day}</th>
              ))}
              <th className="px-4 py-3 text-right font-normal">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-600">
            {projects.map((proj) => (
              <tr key={proj._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${proj.color}`}></span>
                  <span className="font-medium text-gray-800">{proj.name}</span>
                </td>
                {proj.hours.map((hour, idx) => (
                  <td key={idx} className="px-2 py-2">
                    <input 
                      type="text" 
                      value={hour}
                      onChange={(e) => handleInputChange(proj._id, idx, e.target.value)}
                      onBlur={() => saveToDatabase(proj._id)}
                      className="w-full border border-gray-200 rounded px-1 py-1.5 text-center focus:border-blue-400 outline-none text-xs text-gray-700 font-medium"
                    />
                  </td>
                ))}
                {/* Dynamically display row total */}
                <td className="px-4 py-3 text-right font-semibold text-gray-700">
                  {getRowTotal(proj.hours)}
                </td>
              </tr>
            ))}
            
            {/* NEW FOOTER ROW FOR DAILY TOTALS */}
            <tr className="bg-gray-50/80 border-t-2 border-gray-200">
              <td className="px-4 py-3 font-medium text-gray-500">Total</td>
              {days.map((_, idx) => (
                <td key={idx} className="px-2 py-3 text-center font-semibold text-gray-700">
                  {getColTotal(idx)}
                </td>
              ))}
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {getGrandTotal()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-200 flex bg-white">
        <button onClick={addNewRow} className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50">
          <PlusCircle size={16} /> Add new row
        </button>
      </div>
    </div>
  );
};

export default TimesheetGrid;