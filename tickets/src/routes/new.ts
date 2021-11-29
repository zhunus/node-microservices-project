import { Router, Request, Response } from 'express';
import { requireAuth, currentUser, validateRequest } from '@gzhtickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket.model';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.post(
  '/api/tickets',
  currentUser,
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .isLength({ min: 3, max: 40 })
      .withMessage('wrong title'),
    body('price')
      .not()
      .isEmpty()
      .isCurrency({ allow_negatives: false })
      .withMessage('wrong price'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketsRouter };
