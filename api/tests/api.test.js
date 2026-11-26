const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/db');

jest.mock('../src/db', () => ({
  pool: {
    query: jest.fn()
  },
  initDb: jest.fn()
}));

describe('QuickNotes API Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /health returns 200 when DB is reachable', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /health returns 503 when DB fails', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB down'));
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(503);
    expect(res.body.status).toBe('error');
  });

  test('GET /api/notes returns list of notes', async () => {
    const mockNotes = [{ id: 1, content: 'Hello DevSecOps' }];
    pool.query.mockResolvedValueOnce({ rows: mockNotes });
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockNotes);
  });

  test('POST /api/notes creates a valid note', async () => {
    const created = { id: 2, content: 'New note' };
    pool.query.mockResolvedValueOnce({ rows: [created] });
    const res = await request(app)
      .post('/api/notes')
      .send({ content: 'New note' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(created);
  });

  test('POST /api/notes rejects empty content', async () => {
    const res = await request(app).post('/api/notes').send({ content: '   ' });
    expect(res.statusCode).toBe(400);
  });
});
