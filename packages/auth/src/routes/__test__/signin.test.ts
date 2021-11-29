import request from 'supertest';
import { app } from '../../app';

describe('Signin tests', () => {
  it('should return 404 when no user found', async () => {
    return request(app)
      .post('/api/users/singin')
      .send({
        email: 'valid@email.com',
        password: 'password',
      })
      .expect(404);
  });

  it('should return user when auth is successful', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'valid@email.com',
        password: 'password',
      })
      .expect(201);

    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'valid@email.com',
        password: 'password',
      })
      .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
  });

  it('should return 400 when auth is not successful', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'valid@email.com',
        password: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'valid@email.com',
        password: 'wrong_password',
      })
      .expect(400);
  });
});
