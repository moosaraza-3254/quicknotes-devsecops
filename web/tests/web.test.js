const request = require('supertest');
const app = require('../src/app');

describe('QuickNotes Web Service', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('GET /health returns 200 ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok', service: 'web' });
  });

  test('GET /notes proxies notes from API', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => [{ id: 1, content: 'Test note' }]
    });
    const res = await request(app).get('/notes');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, content: 'Test note' }]);
  });

  test('POST /notes forwards note to API', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 201,
      json: async () => ({ id: 2, content: 'Created' })
    });
    const res = await request(app).post('/notes').send({ content: 'Created' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 2, content: 'Created' });
  });

  test('GET /notes returns 502 when API is unreachable', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Connection refused'));
    const res = await request(app).get('/notes');
    expect(res.statusCode).toBe(502);
  });
});
