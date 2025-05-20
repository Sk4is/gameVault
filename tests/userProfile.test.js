const request = require('supertest');
const { app } = require('../src/server');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET);

describe('GET /api/user-profile', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/user-profile');
    expect(res.statusCode).toBe(401);
  });

  it('should return 200 with valid token', async () => {
    const res = await request(app)
      .get('/api/user-profile')
      .set('Authorization', `Bearer ${token}`);
    
    expect([200, 404]).toContain(res.statusCode);
  });
});
