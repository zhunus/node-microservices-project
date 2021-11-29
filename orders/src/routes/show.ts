import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@gzhtickets/common';
import { Request, Response, Router } from 'express';
import { Order } from '../models/order';

const router = Router();

router.get(
  '/api/orders/:id',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as getRouter };
