const express = require('express');
const axios = require('axios');
const router = express.Router();
const Book = require('../models/Book');

// =====================
// User-tracked books
// =====================

// Create a tracked book
router.post('/', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Update tracked book (status/rating)
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete tracked book
router.delete('/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// Search books online (Open Library API)
// =====================
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query missing" });

  try {
    const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}`);

    // Format the results (limit to 10 for simplicity)
    const books = response.data.docs.slice(0, 10).map(book => ({
      title: book.title,
      author: book.author_name ? book.author_name.join(', ') : 'Unknown',
      coverURL: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : '',
      publishYear: book.first_publish_year || 'N/A'
    }));

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
