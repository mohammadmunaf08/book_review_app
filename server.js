const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS setup
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'BookTracker API is running!' });
});

// Books routes
const booksRouter = require('./routes/books');
app.use('/books', booksRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
