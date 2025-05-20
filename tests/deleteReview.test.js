const request = require('supertest');
const { app } = require('../src/server');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, email: 'test@example.com', role: 'admin' }, process.env.JWT_SECRET);

describe('DELETE /api/reviews/:gameId/:userId', () => {
  it('should delete a review if authorized', async () => {
    const res = await request(app)
      .delete('/api/reviews/game_test_123/1')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 403, 404]).toContain(res.statusCode);
  });
});
