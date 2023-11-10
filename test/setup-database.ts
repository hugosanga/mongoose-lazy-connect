import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll, beforeAll } from 'vitest';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    instance: {
      port: 20000
    }
  });

  process.env['MONGODB_URI'] = mongod.getUri();
});

afterAll(async () => {
  await mongod.stop();
});
