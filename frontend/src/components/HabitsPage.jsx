import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Flame, Plus, Check, Trash2 } from 'lucide-react';

const API_URL = '/api/habits/';

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');

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
    if (!newHabitName.trim()) return;
    try {
      const response = await axios.post(API_URL, { name: newHabitName.trim() });
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
      updatedDates = updatedDates.filter(date => date !== todayStr);
      newStreak = Math.max(0, newStreak - 1);
    } else {
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">

      <div className="border-b border-sky-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-emerald-100/80 text-emerald-600">
            <Activity size={20} />
          </span>
          Daily Habits
        </h2>
        <p className="text-slate-500 text-sm mt-1">Build streaks and track your daily routines.</p>
      </div>

      <div className="bg-gradient-to-r from-emerald-50/60 via-white to-teal-50/50 p-5 rounded-xl border border-emerald-100">
        <form onSubmit={addHabit} className="flex gap-3">
          <input
            type="text"
            placeholder="e.g., Drink 2L of Water"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            className="flex-1 bg-white border border-emerald-200/80 rounded-lg px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus size={16} /> Add Habit
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map(habit => {
          const isDoneToday = habit.completedDates.includes(todayStr);
          return (
            <div
              key={habit._id}
              className={`p-5 rounded-xl border flex items-center justify-between group transition-colors ${
                isDoneToday
                  ? 'bg-gradient-to-br from-emerald-50/75 via-white to-teal-50/40 border-emerald-200/80'
                  : 'bg-gradient-to-br from-white via-white to-amber-50/45 border-sky-100 hover:border-amber-200/80'
              }`}
            >
              <div>
                <h3 className="text-slate-800 font-semibold">{habit.name}</h3>
                <div className="flex items-center gap-1.5 text-amber-600 mt-1.5">
                  <Flame size={15} />
                  <span className="text-xs font-medium tabular-nums">{habit.streak} Day Streak</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleCheckIn(habit)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isDoneToday
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-sky-50 text-sky-400 hover:bg-emerald-50 hover:text-emerald-600 border border-sky-100'
                  }`}
                  title={isDoneToday ? 'Checked in today' : 'Check in for today'}
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => deleteHabit(habit._id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-md transition-all"
                  title="Delete habit"
                >
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