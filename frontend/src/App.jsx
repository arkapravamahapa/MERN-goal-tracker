import FavoritesPage from './components/FavoritesPage';
import InboxPage from './components/InboxPage';
import GoalsPage from './components/GoalsPage';
import LifeAreasPage from './components/LifeAreasPage';
import InsightsPage from './components/InsightsPage';
import UpcomingPage from './components/UpcomingPage';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Component Imports
import DashboardLayout from './components/DashboardLayout';
import HabitsPage from './components/HabitsPage';
import TodayPage from './components/TodayPage';
import TimelineChart from './components/TimelineChart';
import TimesheetGrid from './components/TimesheetGrid';

const API_URL = 'http://localhost:5000/api/goals/';

function App() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get(API_URL);
        setGoals(response.data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };
    fetchGoals();
  }, []);

  const addGoal = async (goalData) => {
    try {
      const response = await axios.post(API_URL, goalData);
      setGoals([...goals, response.data]);
    } catch (error) {
      console.error('Error adding goal:', error);
      alert('Error adding goal');
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(API_URL + id);
      setGoals(goals.filter((goal) => goal._id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const toggleGoal = async (id, completed) => {
    try {
      const response = await axios.put(API_URL + id, { completed });
      setGoals(goals.map((goal) => (goal._id === id ? response.data : goal)));
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  return (
    <Router>
      <DashboardLayout>
        <Routes>
          {/* Core Task Views (Reusing TodayPage with different filters) */}
          <Route path="/" element={
            <TodayPage goals={goals} addGoal={addGoal} deleteGoal={deleteGoal} toggleGoal={toggleGoal} defaultFilter="Active" />
          } />
          
          <Route path="/all-tasks" element={
            <TodayPage goals={goals} addGoal={addGoal} deleteGoal={deleteGoal} toggleGoal={toggleGoal} defaultFilter="All" />
          } />
          
          <Route path="/completed" element={
            <TodayPage goals={goals} addGoal={addGoal} deleteGoal={deleteGoal} toggleGoal={toggleGoal} defaultFilter="Completed" />
          } />

          {/* Other Functional Pages */}
          <Route path="/timeline" element={<TimelineChart goals={goals} />} />
          <Route path="/projects" element={<TimesheetGrid />} />
          <Route path="/upcoming" element={<UpcomingPage goals={goals} toggleGoal={toggleGoal} />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          
          {/* SaaS Architecture Placeholders */}
          <Route path="/inbox" element={<InboxPage goals={goals} addGoal={addGoal} toggleGoal={toggleGoal} deleteGoal={deleteGoal} />} />
          <Route path="/life-areas" element={<LifeAreasPage goals={goals} />} />
          <Route path="/goals" element={<GoalsPage goals={goals} toggleGoal={toggleGoal} deleteGoal={deleteGoal} />} />
          <Route path="/favorites/:id" element={<FavoritesPage goals={goals} toggleGoal={toggleGoal} deleteGoal={deleteGoal} />} />
        </Routes>   
      </DashboardLayout>
    </Router>
  );
}

export default App;