import request from 'supertest';
import { app } from '../app';

test('not found page test', async () => {
  await request(app).get('asdfasdfa').expect(404);
});
