import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

describe('Show order tests', () => {
  it('should return 404 if no order found', async () => {
    const orderId = new mongoose.Types.ObjectId();
    await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Cookie', global.signin())
      .expect(404);
  });

  it('should return 401 if requesting order doesnt belong to user', async () => {
    const user = global.signin();
    const otherUser = global.signin();

    const ticket = Ticket.build({ title: '123', price: 123 });
    await ticket.save();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .expect(200);

    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', otherUser)
      .expect(401);
  });
});
