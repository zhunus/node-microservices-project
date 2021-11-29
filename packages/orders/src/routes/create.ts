import mongoose from 'mongoose';
import { Request, Response, Router } from 'express';
import {
  BadRequestError,
  currentUser,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@gzhtickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

// 15min expiration
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = Router();

router.post(
  '/api/orders',
  currentUser,
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      .custom((input) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('Order is already reserved!');
    }

    const expiration = new Date();

    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      ticket,
      expiresAt: expiration,
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
    });

    await order.save();

    res.status(201).send(order);
  }
);

export { router as createRoute };
