import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Flame, Plus, Check, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/habits/';

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');

  // Today's date formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await axios.get(API_URL);
        setHabits(response.data);
      } catch (error) {
        console.error('Error fetching habits:', error);
      }
    };
    fetchHabits();
  }, []);

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName) return;
    try {
      const response = await axios.post(API_URL, { name: newHabitName });
      setHabits([...habits, response.data]);
      setNewHabitName('');
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const toggleCheckIn = async (habit) => {
    const isDoneToday = habit.completedDates.includes(todayStr);
    let updatedDates = [...habit.completedDates];
    let newStreak = habit.streak;

    if (isDoneToday) {
      // Uncheck it
      updatedDates = updatedDates.filter(date => date !== todayStr);
      newStreak = Math.max(0, newStreak - 1);
    } else {
      // Check it in
      updatedDates.push(todayStr);
      newStreak += 1;
    }

    try {
      const response = await axios.put(API_URL + habit._id, { 
        completedDates: updatedDates,
        streak: newStreak
      });
      setHabits(habits.map(h => h._id === habit._id ? response.data : h));
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await axios.delete(API_URL + id);
      setHabits(habits.filter(h => h._id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="text-blue-600" /> Daily Habits
        </h2>
        <p className="text-gray-500 text-sm mt-1">Build streaks and track your daily routines.</p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={addHabit} className="flex gap-4">
          <input 
            type="text" 
            placeholder="e.g., Drink 2L of Water" 
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            className="flex-1 border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 flex items-center gap-1">
            <Plus size={16} /> Add Habit
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map(habit => {
          const isDoneToday = habit.completedDates.includes(todayStr);
          return (
            <div key={habit._id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between group">
              <div>
                <h3 className="text-gray-800 font-semibold">{habit.name}</h3>
                <div className="flex items-center gap-1 text-orange-500 mt-1">
                  <Flame size={16} /> 
                  <span className="text-xs font-medium">{habit.streak} Day Streak</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleCheckIn(habit)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isDoneToday ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  <Check size={20} />
                </button>
                <button onClick={() => deleteHabit(habit._id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default HabitsPage;