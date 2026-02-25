const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Importe tes routes
const voteRoutes = require('./src/routes/routes');
app.use('/api/votes', voteRoutes);

