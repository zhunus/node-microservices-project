import express from 'express';
import 'express-async-errors';

import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError } from '@gzhtickets/common';

import { createRoute } from './routes/create';
import { indexRouter } from './routes';
import { getRouter } from './routes/show';

const app = express();

app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(createRoute);
app.use(indexRouter);
app.use(getRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
