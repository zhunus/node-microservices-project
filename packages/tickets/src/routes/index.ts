import { currentUser, requireAuth } from '@gzhtickets/common';
import { Router, Response, Request } from 'express';
import { Ticket } from '../models/ticket.model';

const router = Router();

router.get(
  '/api/tickets',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const tickets = await Ticket.find();
    res.send(tickets);
  }
);

export { router as indexRouter };
