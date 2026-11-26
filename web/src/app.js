const path = require('path');
const express = require('express');

const app = express();
const API_URL = process.env.API_URL || 'http://localhost:4000';

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'web' });
});

app.get('/notes', async (_req, res) => {
  try {
    const response = await fetch(`${API_URL}/api/notes`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'API service unreachable' });
  }
});

app.post('/notes', async (req, res) => {
  try {
    const response = await fetch(`${API_URL}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: req.body?.content })
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'API service unreachable' });
  }
});

module.exports = app;
