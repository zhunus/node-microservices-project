import request from 'supertest';
import { app } from '../../app';

describe('Current user tests', () => {
  it('should respond with current user', async () => {
    const cookie = await signin();

    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body.currentUser.email).toEqual('valid@email.com');
  });

  it('should return null when not auth', async () => {
    const response = await request(app)
      .get('/api/users/currentuser')
      .expect(200);

    expect(response.body.currentUser).toBeNull();
  });
});
