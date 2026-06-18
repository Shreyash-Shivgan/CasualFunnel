const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS for frontend dashboard (running on Vite, usually port 5173)
app.use(cors());

// Body parser
app.use(express.json());

// 1. Serve the standalone tracker script directly from its location
app.get('/tracker.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../tracker/tracker.js'));
});

// 2. Serve static demo site pages (Home, Pricing, About) from public folder
app.use(express.static(path.join(__dirname, 'public')));

// 3. API Routes
app.use('/api', require('./routes/analyticsRoutes'));

// Root path redirects to demo or shows status
app.get('/', (req, res) => {
  res.send('CasualFunnel Analytics API is running. Visit /demo/ for the tracked website.');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Demo site available at http://localhost:${PORT}/demo/`);
});
