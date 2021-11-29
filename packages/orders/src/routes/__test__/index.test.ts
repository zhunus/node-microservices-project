import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

async function buildTicket() {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  return ticket;
}

describe('Get orders', () => {
  it('should return orders for particular user ', async () => {
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const user1 = global.signin();
    const user2 = global.signin();

    const { body: orderOne } = await request(app)
      .post('/api/orders')
      .set('Cookie', user1)
      .send({ ticketId: ticketOne.id })
      .expect(201);

    const { body: orderTwo } = await request(app)
      .post('/api/orders')
      .set('Cookie', user2)
      .send({ ticketId: ticketTwo.id })
      .expect(201);

    const { body: orderThree } = await request(app)
      .post('/api/orders')
      .set('Cookie', user2)
      .send({ ticketId: ticketThree.id })
      .expect(201);

    const response = await request(app)
      .get('/api/orders')
      .set('Cookie', user2)
      .expect(200);

    expect(response.body.length).toBe(2);

    expect(response.body[0].id).toEqual(orderTwo.id);
    expect(response.body[1].id).toEqual(orderThree.id);
    expect(response.body[0].ticket.id).toEqual(orderTwo.ticket.id);
  });
});
