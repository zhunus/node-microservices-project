export enum OrderStatus {
  /**
   * When the order is created but ticket has not been reserved
   */
  Created = 'created',

  /**
   * When the ticket the order is trying to reserve is has already been reserved
   * or the order is expired while waiting for payment
   */
  Canceled = 'canceled',

  /**
   * When order is awaiting payment
   */
  AwaitingPayment = 'awaiting:payment',

  /**
   * When the order is fullfilled
   */
  Complete = 'complete',
}
