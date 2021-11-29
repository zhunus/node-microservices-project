import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

describe('Update ticket tests', () => {
  it('should return 404 if provided id not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signin())
      .send({ title: 'valid', price: 12 })
      .expect(404);
  });

  it('should return 401 if not auth', async () => {
    const { body } = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'sometitle', price: 10 })
      .expect(201);

    const ticket = body;

    await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set('Cookie', global.signin())
      .send({ title: 'valid', price: 12 })
      .expect(401);
  });

  it('should return 400 if provided values are incorrect', async () => {
    const jwt = global.signin();
    const { body } = await request(app)
      .post('/api/tickets')
      .set('Cookie', jwt)
      .send({ title: 'sometitle', price: 10 })
      .expect(201);

    const ticket = body;

    await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set('Cookie', jwt)
      .send({ price: 12 })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set('Cookie', jwt)
      .send({ title: 'sometitle' })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set('Cookie', jwt)
      .send({})
      .expect(400);

    await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set('Cookie', jwt)
      .send({ price: -12 })
      .expect(400);
  });

  it('should return 200 if provided values are correct', async () => {
    const jwt = global.signin();
    const { body } = await request(app)
      .post('/api/tickets')
      .set('Cookie', jwt)
      .send({ title: 'sometitle', price: 10 })
      .expect(201);

    const ticket = body;

    const response = await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set('Cookie', jwt)
      .send({ title: 'sometitle', price: 12 })
      .expect(200);

    expect(response.body.title).toBe('sometitle');
    expect(response.body.price).toBe(12);
  });

  it('should trigger ticket updated event', async () => {
    const jwt = global.signin();
    const { body } = await request(app)
      .post('/api/tickets')
      .set('Cookie', jwt)
      .send({ title: 'sometitle', price: 10 })
      .expect(201);

    expect(natsWrapper.client.publish).toBeCalledTimes(1);

    const ticket = body;

    const response = await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set('Cookie', jwt)
      .send({ title: 'sometitle', price: 12 })
      .expect(200);
    expect(natsWrapper.client.publish).toBeCalledTimes(2);

    expect(response.body.title).toBe('sometitle');
    expect(response.body.price).toBe(12);
  });
});
