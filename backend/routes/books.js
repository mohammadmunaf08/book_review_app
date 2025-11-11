const express = require('express');
const router = express.Router();
const axios = require('axios');

// =====================
// Search books online (filtered)
// =====================
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query missing" });

  try {
    const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}`);
    let books = response.data.docs.slice(0, 30).map(book => ({
      title: book.title,
      author: book.author_name ? book.author_name.join(', ') : 'Unknown',
      coverURL: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : '',
      publishYear: book.first_publish_year || ''
    }));

    // ---- FILTERING CODE BELOW ----
    // 1. Remove duplicates by title
    const uniqueBooks = [];
    const seenTitles = new Set();

    books.forEach(book => {
      const normalizedTitle = book.title.toLowerCase().trim();
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueBooks.push(book);
      }
    });

    // 2. Optional: filter by publish year (e.g., after 1900)
    const filteredBooks = uniqueBooks.filter(b => b.publishYear >= 1900);

    // 3. Optional: only keep books that actually contain the query word
    const finalBooks = filteredBooks.filter(b =>
      b.title.toLowerCase().includes(q.toLowerCase())
    );

    res.json(finalBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

