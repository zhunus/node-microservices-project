import { response } from 'express';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';

describe('New page tests', () => {
  it('should have a route handler listening to /api/tickets for post tickets', async () => {
    const response = await request(app).post('/api/tickets');

    expect(response.status).not.toBe(404);
    expect(natsWrapper.client.publish).not.toBeCalled();
  });

  it('should return 401 if user is NOT authed', async () => {
    await request(app).post('/api/tickets').expect(401);
    expect(natsWrapper.client.publish).not.toBeCalled();
  });

  it('should NOT return 401 if user is authed', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({});

    expect(response.status).not.toBe(401);
    expect(natsWrapper.client.publish).not.toBeCalled();
  });

  it('should return err if invaild title is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ price: 10 })
      .expect(400);
    expect(natsWrapper.client.publish).not.toBeCalled();
  });

  it('should create a ticket if values are valid', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toBe(0);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'ttt', price: 10 })
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toBe(1);
    expect(natsWrapper.client.publish).toBeCalled();
  });

  it('should return err if invalid price is passed', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'somet1', price: -10 })
      .expect(400);
    expect(natsWrapper.client.publish).not.toBeCalled();

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'somet2' })
      .expect(400);
    expect(natsWrapper.client.publish).not.toBeCalled();
  });
});
