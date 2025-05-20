const request = require('supertest');
const { app } = require('../src/server');

describe('GET /api/reviews/:gameId', () => {
  it('should fetch all reviews for a game', async () => {
    const res = await request(app).get('/api/reviews/game_test_123');
    expect(res.statusCode).toBe(200);
  });
});
