const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const processTypeRoutes = require('./routes/processTypeRoutes');
const dealRoutes = require('./routes/dealRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/process-types', processTypeRoutes);
app.use('/api/deals', dealRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API documentation:`);
  console.log(`  - Authentication: POST /api/auth/login`);
  console.log(`  - Users: GET/POST /api/users, PUT/DELETE /api/users/:id`);
  console.log(`  - Process Types: GET/POST /api/process-types, PUT/DELETE /api/process-types/:id`);
  console.log(`  - Deals: GET/POST /api/deals, PUT/DELETE /api/deals/:id, PATCH /api/deals/:id/stage`);
});
