import request from 'supertest';
import { app } from '../../app';

describe('Signup tests', () => {
  it('returns a 201 on success', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({ email: 'valid@email.com', password: 'password' })
      .expect(201);
  });

  it('should return 400 with an invalid email', function () {
    return request(app)
      .post('/api/users/signup')
      .send({ email: 'invalid@emai', password: 'password' })
      .expect(400);
  });

  it('should return 400 with an invalid password', function () {
    return request(app)
      .post('/api/users/signup')
      .send({ email: 'valid@email.com', password: 'p' })
      .expect(400);
  });

  it('should return 400 with missing email and password', async function () {
    await request(app).post('/api/users/signup').send({}).expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({ email: 'valid@email.com' })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({ password: 'password' })
      .expect(400);
  });

  it('should return 400 when creating new user twice', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'valid@email.com', password: 'password' })
      .expect(201);

    await request(app)
      .post('/api/users/signup')
      .send({ email: 'valid@email.com', password: 'password' })
      .expect(400);
  });

  it('should set cookie after successful request', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({ email: 'valid@email.com', password: 'password' })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
