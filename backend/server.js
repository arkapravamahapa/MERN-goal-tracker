const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Helps parse form data

// Add our Goal routes here
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/users', require('./routes/userRoutes')); // <-- Add this line
app.use('/api/habits', require('./routes/habitRoutes')); // <-- Add this line
app.use('/api/ai', require('./routes/aiRoutes'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});