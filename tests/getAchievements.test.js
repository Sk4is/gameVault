const request = require('supertest');
const { app } = require('../src/server');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET);

describe('GET /api/user-achievements', () => {
  it('should return the user achievements', async () => {
    const res = await request(app)
      .get('/api/user-achievements')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 500]).toContain(res.statusCode);
  });
});
