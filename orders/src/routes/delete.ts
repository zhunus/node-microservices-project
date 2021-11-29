import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@gzhtickets/common';
import { Router, Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';

const router = Router();

router.delete(
  '/api/orders/:id',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const order = await Order.findById(id);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Canceled;

    res.send(order);
  }
);

export { router as deleteRouter };
