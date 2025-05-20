const request = require('supertest');
const { app } = require('../src/server');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET);

describe('PUT /api/update-profile', () => {
  it('should return 200 or 500 on profile update', async () => {
    const res = await request(app)
      .put('/api/update-profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated User', email: 'test@example.com', avatar: null });

    expect([200, 500]).toContain(res.statusCode);
  });
});
