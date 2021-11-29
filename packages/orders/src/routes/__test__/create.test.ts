import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

describe('Creating order tests', () => {
  beforeEach(() => {});

  it('should throw 404 if ticket is not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();
    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId })
      .expect(404);
  });

  it('should throw 400 if ticket is already reserved', async () => {
    const ticket = Ticket.build({
      title: 'Concert',
      price: 40,
    });

    await ticket.save();
    const order = Order.build({
      ticket,
      userId: '123',
      status: OrderStatus.Created,
      expiresAt: new Date(),
    });

    await order.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({
        ticketId: ticket.id,
      })
      .expect(400);
  });

  it('should create order if all good', async () => {
    const ticket = Ticket.build({
      title: 'Concert',
      price: 40,
    });

    await ticket.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);
  });
});
