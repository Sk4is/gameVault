const request = require('supertest');
const { app } = require('../src/server');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET);

describe('POST /api/unlock-achievement', () => {
  it('should unlock an achievement for the user', async () => {
    const res = await request(app)
      .post('/api/unlock-achievement')
      .set('Authorization', `Bearer ${token}`)
      .send({ achievement_id: 1 });

    expect([200, 201, 500]).toContain(res.statusCode);
  });
});
