import { Router, Request, Response } from 'express';
import { requireAuth, currentUser, NotFoundError } from '@gzhtickets/common';
import { Ticket } from '../models/ticket.model';

const router = Router();

router.get(
  '/api/tickets/:id',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }

    return res.status(200).send(ticket);
  }
);

export { router as ticketRouter };
