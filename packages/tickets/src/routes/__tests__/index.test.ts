import request from 'supertest';
import { app } from '../../app';

describe('Index tickets', () => {
  it('should return empty array', async () => {
    const { body } = await request(app)
      .get('/api/tickets')
      .set('Cookie', global.signin())
      .expect(200);

    expect(body).toEqual([]);
  });

  it('should return list of tickets', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'somet', price: 10 })
      .expect(201);

    const { body } = await request(app)
      .get('/api/tickets')
      .set('Cookie', global.signin())
      .expect(200);

    expect(body.length).toEqual(1);
  });
});
