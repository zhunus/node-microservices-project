import mongoose from 'mongoose';
import { app } from './app';

async function start() {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT secret must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO uri secret must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Auth is listening on port 3000');
  });
}

start();
