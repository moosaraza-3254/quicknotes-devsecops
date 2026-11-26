const express = require('express');
const { pool } = require('./db');

const app = express();
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', service: 'api', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', service: 'api', db: err.message });
  }
});

app.get('/api/notes', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, content, created_at FROM notes ORDER BY id DESC LIMIT 50'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  const content =
    typeof req.body?.content === 'string' ? req.body.content.trim() : '';
  if (!content || content.length > 280) {
    return res
      .status(400)
      .json({ error: 'Note content must be between 1 and 280 characters' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO notes (content) VALUES ($1) RETURNING id, content, created_at',
      [content]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save note' });
  }
});

module.exports = app;
