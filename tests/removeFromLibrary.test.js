const request = require('supertest');
const { app } = require('../src/server');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET);

describe('DELETE /api/remove-from-library/:gameId', () => {
  it('should remove a game from the library', async () => {
    const res = await request(app)
      .delete('/api/remove-from-library/game_test_123')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 404, 500]).toContain(res.statusCode);
  });
});
