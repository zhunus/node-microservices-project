import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

describe('Ticket api', () => {
  it('should return 404 if ticket not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .get(`/api/tickets/${id}`)
      .set('Cookie', global.signin())
      .expect(404);
  });

  it('should return ticket if it exists', async () => {
    const { body } = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'somet', price: 10 })
      .expect(201);

    const ticket = body;

    const response = await request(app)
      .get(`/api/tickets/${ticket.id}`)
      .set('Cookie', global.signin())
      .expect(200);

    expect(response.body).toEqual(ticket);
  });
});
