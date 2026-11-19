import { useState } from 'react';

const GoalForm = ({ addGoal }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Personal Development');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !startDate || !endDate) {
      setError('Please fill out Goal Name, Start Date, and End Date.');
      return;
    }

    setError('');
    addGoal({ text: text.trim(), category, startDate, endDate });

    setText('');
    setStartDate('');
    setEndDate('');
    setCategory('Personal Development');
  };

  return (
    <section className="bg-sky-50/50 p-4 rounded-lg border border-sky-100">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">

        {/* Top Row: Name and Category */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-600 mb-1">Goal Name</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Complete a Full Ironman"
              className="w-full bg-white border border-sky-200/80 rounded-lg p-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
            />
          </div>
          <div className="sm:w-1/3">
            <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-sky-200/80 rounded-lg p-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
            >
              <option value="Work & Career">Work & Career</option>
              <option value="Sport & Health">Sport & Health</option>
              <option value="Personal Development">Personal Development</option>
              <option value="Fun & Relaxation">Fun & Relaxation</option>
            </select>
          </div>
        </div>

        {/* Bottom Row: Dates and Submit */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="sm:w-1/3">
            <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-white border border-sky-200/80 rounded-lg p-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-slate-700 transition-all"
            />
          </div>
          <div className="sm:w-1/3">
            <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-white border border-sky-200/80 rounded-lg p-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-slate-700 transition-all"
            />
          </div>
          <div className="sm:w-1/3">
            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors whitespace-nowrap"
            >
              Add Goal
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-md px-3 py-1.5">
            {error}
          </p>
        )}

      </form>
    </section>
  );
};

export default GoalForm;