import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'test';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  process.env.JWT_KEY = 'secret';
  const collections = await mongoose.connection.db.collections();
  for (let col of collections) {
    await col.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  const token = jwt.sign(
    {
      email: 'valid@email.com',
      id: new mongoose.Types.ObjectId().toHexString(),
    },
    process.env.JWT_KEY!
  );

  const session = { jwt: token };

  return [
    'express:sess=' + Buffer.from(JSON.stringify(session)).toString('base64'),
  ];
};
