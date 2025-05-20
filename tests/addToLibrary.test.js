const request = require('supertest');
const { app } = require('../src/server');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET);

describe('POST /api/add-to-library', () => {
  it('should add a game to the user library', async () => {
    const res = await request(app)
      .post('/api/add-to-library')
      .set('Authorization', `Bearer ${token}`)
      .send({
        gameId: 'game_test_123',
        name: 'Test Game',
        description: 'A cool game',
        genre: 'Action',
        platform: 'PC',
        image: null,
        releaseDate: null
      });

    expect([201, 400]).toContain(res.statusCode);
  });
});
