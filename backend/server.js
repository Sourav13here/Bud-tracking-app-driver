// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const otpRoutes = require('./routes/otp');
const accountRoutes = require('./routes/account');
const busRoutes = require('./routes/bus');
const stoppageRoutes = require('./routes/stoppage');

app.use('/api/otp', otpRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/route',stoppageRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// This code sets up an Express server with CORS enabled and JSON body parsing.
// It imports the driver routes and mounts them under the `/api/driver` path.