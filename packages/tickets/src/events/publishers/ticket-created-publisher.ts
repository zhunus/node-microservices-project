import { Publisher, Subjects, TicketCreatedEvent } from '@gzhtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject = Subjects.TicketCreated;
}
