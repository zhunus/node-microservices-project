import {
  currentUser,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  validateRequest,
} from '@gzhtickets/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { Ticket } from '../models/ticket.model';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.put(
  '/api/tickets/:id',
  currentUser,
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title should be provided'),
    body('price')
      .isCurrency({ allow_negatives: false })
      .withMessage('Price must be correct'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (req.currentUser!.id !== ticket.userId) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    return res.send(ticket);
  }
);

export { router as updateRouter };
