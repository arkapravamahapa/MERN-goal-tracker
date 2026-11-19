import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = '/api/projects/';

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
    const palette = ['bg-sky-400', 'bg-violet-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400'];
    const color = palette[projects.length % palette.length];
    try {
      const response = await axios.post(API_URL, { name: 'New Project', color });
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error('Error adding project row:', error);
    }
  };

  const handleInputChange = (projectId, dayIndex, value) => {
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

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    if (timeStr.includes(':')) {
      const [hours, mins] = timeStr.split(':');
      return (parseInt(hours || 0)) + (parseInt(mins || 0) / 60);
    }
    return parseFloat(timeStr) || 0;
  };

  const formatTime = (decimal) => {
    if (decimal === 0) return '0:00';
    const hours = Math.floor(decimal);
    const mins = Math.round((decimal - hours) * 60);
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  const getRowTotal = (hoursArray) => {
    const totalDec = hoursArray.reduce((sum, val) => sum + parseTime(val), 0);
    return formatTime(totalDec);
  };

  const getColTotal = (dayIndex) => {
    const totalDec = projects.reduce((sum, proj) => sum + parseTime(proj.hours[dayIndex]), 0);
    return formatTime(totalDec);
  };

  const getGrandTotal = () => {
    let grandDec = 0;
    projects.forEach(proj => {
      proj.hours.forEach(val => grandDec += parseTime(val));
    });
    return formatTime(grandDec);
  };

  return (
    <div className="bg-white rounded-xl border border-sky-100 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-sky-100 bg-gradient-to-r from-teal-50/60 via-white to-sky-50/60">
        <h2 className="text-xl font-semibold text-slate-800">Weekly Timesheet</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-sky-50/60 text-sky-800 border-b border-sky-100 text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 w-48 font-semibold">Projects</th>
              {days.map((day) => (
                <th key={day} className="px-2 py-3 text-center font-semibold w-24">{day}</th>
              ))}
              <th className="px-4 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50 text-slate-600">
            {projects.map((proj) => (
              <tr key={proj._id} className="hover:bg-sky-50/40 transition-colors">
                <td className="px-4 py-3 flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${proj.color}`}></span>
                  <span className="font-medium text-slate-800">{proj.name}</span>
                </td>
                {proj.hours.map((hour, idx) => (
                  <td key={idx} className="px-2 py-2">
                    <input
                      type="text"
                      value={hour}
                      onChange={(e) => handleInputChange(proj._id, idx, e.target.value)}
                      onBlur={() => saveToDatabase(proj._id)}
                      className="w-full border border-sky-100 bg-sky-50/30 rounded-md px-1 py-1.5 text-center focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-xs text-slate-700 font-medium tabular-nums transition-all"
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-right font-semibold text-slate-800 tabular-nums">
                  {getRowTotal(proj.hours)}
                </td>
              </tr>
            ))}

            <tr className="bg-teal-50/50 border-t-2 border-teal-100">
              <td className="px-4 py-3 font-semibold text-teal-900">Total</td>
              {days.map((_, idx) => (
                <td key={idx} className="px-2 py-3 text-center font-semibold text-teal-800 tabular-nums">
                  {getColTotal(idx)}
                </td>
              ))}
              <td className="px-4 py-3 text-right font-bold text-teal-900 tabular-nums">
                {getGrandTotal()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-sky-100 flex bg-sky-50/20">
        <button
          onClick={addNewRow}
          className="flex items-center gap-1.5 text-sky-700 hover:text-sky-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-sky-100/70 transition-colors"
        >
          <PlusCircle size={16} /> Add new row
        </button>
      </div>
    </div>
  );
};

export default TimesheetGrid;