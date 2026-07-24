// backend/server.js

// 1. Import Core Dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 2. Import Database Connection & API Routes
const connectDB = require('./config/db.js');
const issueRoutes = require('./routes/issueRoutes.js');

// 3. Load Environment Variables from .env file
dotenv.config();

// 4. Initialize Database Connection
connectDB();

// 5. Initialize Express Application Instance
const app = express();

// 6. Global Middlewares
// Enables CORS so React frontend (http://localhost:5173) can talk to Express API
app.use(cors());

// Parses incoming JSON payloads in request bodies (req.body)
app.use(express.json());

// 7. Mount API Routes
// Any request starting with /api/issues will be handled by issueRoutes.js
app.use('/api/issues', issueRoutes);

// 8. Base Health Check Route (Sanity Check)
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'CivicFix API Server is running smoothly!',
    timestamp: new Date().toISOString()
  });
});

// 9. Start Listening on Specified Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`=================================`);
});