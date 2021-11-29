import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

async function start() {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT secret must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo uri secret must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS uri secret must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS client id secret must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID uri secret must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log(err);
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
  } catch (err) {
    throw new Error('Could not connect to NATS');
  }

  app.listen(3000, () => {
    console.log('Tickets is listening on port 3000');
  });
}

start();
