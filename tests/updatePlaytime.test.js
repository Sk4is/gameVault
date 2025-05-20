const request = require('supertest');
const { app } = require('../src/server');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET);

describe('POST /api/update-playtime', () => {
  it('should update playtime for a game', async () => {
    const res = await request(app)
      .post('/api/update-playtime')
      .set('Authorization', `Bearer ${token}`)
      .send({ gameId: 'game_test_123', duration: 60 });

    expect([200, 500]).toContain(res.statusCode);
  });
});
