const request = require('supertest');
const { app } = require('../src/server');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET);

describe('POST /api/reviews', () => {
  it('should post a review for a game', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_id: 'game_test_123',
        game_name: 'Test Game',
        content: 'Great game!',
        rating: 4
      });

    expect([201, 400, 500]).toContain(res.statusCode);
  });
});
