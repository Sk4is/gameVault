const request = require('supertest');
const { app } = require('../src/server');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET);

describe('GET /api/user-library', () => {
  it('should return the library of the user with correct structure', async () => {
    const res = await request(app)
      .get('/api/user-library')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const game = res.body[0];
      expect(game).toHaveProperty('id');
      expect(game).toHaveProperty('title');
      expect(game).toHaveProperty('image');
      expect(game).toHaveProperty('last_connection');
      expect(game).toHaveProperty('hours_played');
    }
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/user-library');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Token not provided');
  });

  it('should return 401 for invalid token', async () => {
    const res = await request(app)
      .get('/api/user-library')
      .set('Authorization', 'Bearer invalidtoken');
    
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid token');
  });
});
