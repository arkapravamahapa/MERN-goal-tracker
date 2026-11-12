import { useState } from 'react';

const GoalForm = ({ addGoal }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Personal Development');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text || !startDate || !endDate) {
      alert('Please fill out all fields (Text, Start Date, End Date)');
      return;
    }
    
    // Pass the complete object to App.jsx
    addGoal({ text, category, startDate, endDate });
    
    // Reset form
    setText('');
    setStartDate('');
    setEndDate('');
    setCategory('Personal Development');
  };

  return (
    <section className="bg-gray-50 p-4 rounded border border-gray-200 mb-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        
        {/* Top Row: Name and Category */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Goal Name</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Complete a Full Ironman"
              className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-1/3">
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500 bg-white"
            >
              <option value="Work & Career">Work & Career</option>
              <option value="Sport & Health">Sport & Health</option>
              <option value="Personal Development">Personal Development</option>
              <option value="Fun & Relaxation">Fun & Relaxation</option>
            </select>
          </div>
        </div>

        {/* Bottom Row: Dates and Submit */}
        <div className="flex gap-4 items-end">
          <div className="w-1/3">
            <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500 text-gray-700"
            />
          </div>
          <div className="w-1/3">
            <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500 text-gray-700"
            />
          </div>
          <div className="w-1/3">
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
              Add Goal to Database
            </button>
          </div>
        </div>

      </form>
    </section>
  );
};

export default GoalForm;