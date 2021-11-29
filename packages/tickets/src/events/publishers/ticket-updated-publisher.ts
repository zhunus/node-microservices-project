import { Publisher, Subjects, TicketUpdatedEvent } from '@gzhtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject = Subjects.TicketUpdated;
}
