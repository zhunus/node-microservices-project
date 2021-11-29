import express from 'express';
import 'express-async-errors';

import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError } from '@gzhtickets/common';

import { createTicketsRouter } from './routes/new';
import { ticketRouter } from './routes/ticket';
import { indexRouter } from './routes/index';
import { updateRouter } from './routes/update';

const app = express();

app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(createTicketsRouter);
app.use(ticketRouter);
app.use(indexRouter);
app.use(updateRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
