FocusFlow - Enterprise Productivity Dashboard

An enterprise-grade, full-stack productivity and goal management application built with the MERN stack. Designed with a modern SaaS architecture, this application seamlessly integrates complex task management, time tracking, habit streaks, and dynamic data visualization into a single, unified dashboard.

🚀 Tech Stack

Frontend: React.js, Vite, Tailwind CSS, Lucide React (Icons), React Router DOM (Dynamic Routing)

Backend: Node.js, Express.js

Database: MongoDB Atlas, Mongoose (ODM)

Architecture: RESTful API, MVC Pattern, Multi-Collection Schema

✨ Key Features & Technical Highlights

This project goes beyond standard CRUD operations by implementing advanced full-stack mechanics:

Algorithmic Data Aggregation (Insights Dashboard): Simultaneously fetches and processes data across three distinct MongoDB collections (Goals, Timesheets, Habits) to calculate real-time completion rates, total tracked hours, and best streaks.

Cascading Gantt Timeline: Features an advanced, horizontally-scrolling timeline that calculates visual bar widths based on startDate and endDate. Supports nested sub-tasks with a mathematical offset for a true project management "waterfall" effect.

Dynamic React Routing (Favorites): Utilizes useParams to dynamically read URL structures (e.g., /favorites/work) and filter the master database context without requiring separate static pages.

Chronological Sorting Engine (Upcoming): Frontend date-math logic that categorizes active database documents into "Overdue", "Next 7 Days", and "Later" based on the current system time.

Complex Schema Relationships: Database architecture supports arrays of objects for sub-tasks and historical arrays of timestamp strings to track habit consistency over time.

📂 System Modules

Inbox: Rapid task capture bypassing categorical requirements.

Task Views (Today/All/Completed): Reusable component architecture filtering the same dataset across different route states.

Timeline: Visual Gantt chart with nested sub-task arrays.

Timesheet: Live mathematical calculations updating grand totals dynamically upon data entry.

Life Areas: Segmented categorical progress bars mapping array completion ratios.

Master Goals: Searchable enterprise data table.

Habits Tracker: Custom streak-calculation engine reading from an array of logged dates.

🛠️ Installation & Setup

To run this project locally, you will need Node.js and a MongoDB cluster (local or Atlas).

1. Clone the repository

git clone <your-repo-link>
cd mern-goal-tracker


2. Setup the Backend

cd backend
npm install


Create a .env file in the backend directory and add your MongoDB connection string and Port:

NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/YourDatabaseName


3. Setup the Frontend
Open a new terminal window:

cd frontend
npm install


4. Run the Application
Start the backend server (Terminal 1):

cd backend
node server.js


Start the frontend Vite server (Terminal 2):

cd frontend
npm run dev


🗄️ Database Architecture

The application utilizes a multi-collection MongoDB architecture:

Goals Collection: Stores objectives with nested subtasks arrays, categories, and date parameters.

Habits Collection: Stores recurring routines, current integer streaks, and completedDates tracking arrays.

Projects Collection: Stores timesheet entries and decimal-based hour arrays for time tracking.

Developed as a comprehensive demonstration of full-stack engineering, React state management, and NoSQL database design.