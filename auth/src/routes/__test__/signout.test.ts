import request from 'supertest';
import { app } from '../../app';

describe('Signout tests', () => {
  it('should set', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'valid@email.com',
        password: 'password',
      })
      .expect(201);

    const response = await request(app).post('/api/users/signout').expect(200);
    expect(response.get('Set-Cookie')[0]).toEqual(
      'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
  });
});
