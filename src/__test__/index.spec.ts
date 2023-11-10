import mongoose from 'mongoose';
import { mongooseLazyConnect } from 'src';
import { expect, it, describe, beforeAll, afterEach } from 'vitest';

describe('mongooseLazyConnect', () => {
  let model: mongoose.Mongoose['Model'];

  beforeAll(() => {
    const schema = new mongoose.Schema({ name: String });
    model = mongoose.model('Test', schema);
  });

  afterEach(async () => {
    await mongoose.connection.close(true);
    await mongoose.disconnect();
  });

  async function connectOnDatabase(): Promise<void> {
    await mongoose.connect(process.env['MONGODB_URI']!);
  }

  it('should not immediately connect to database', async () => {
    expect(mongoose.connection.readyState).toEqual(mongoose.STATES.disconnected);

    mongooseLazyConnect(connectOnDatabase);

    expect(mongoose.connection.readyState).toEqual(mongoose.STATES.disconnected);
  });

  it.each([
    {
      methodName: 'save',
      methodExecution: () => new model({ name: 'test' }).save()
    },
    {
      methodName: 'aggregate',
      methodExecution: () => model.aggregate([{ $match: { name: 'test' } }])
    },
    {
      methodName: 'bulkSave',
      methodExecution: () => model.bulkSave([])
    },
    {
      methodName: 'bulkWrite',
      methodExecution: () => model.bulkWrite([])
    },
    {
      methodName: 'create',
      methodExecution: () => model.create()
    },
    {
      methodName: 'createCollection',
      methodExecution: () => model.createCollection()
    },
    {
      methodName: 'createIndexes',
      methodExecution: () => model.createIndexes()
    },
    {
      methodName: 'ensureIndexes',
      methodExecution: () => model.ensureIndexes()
    },
    {
      methodName: 'diffIndexes',
      methodExecution: () => model.diffIndexes()
    },
    {
      methodName: 'insertMany',
      methodExecution: () => model.insertMany([])
    },
    {
      methodName: 'populate',
      methodExecution: () => model.populate([], 'name')
    },
    {
      methodName: 'validate',
      methodExecution: () => model.validate({ name: 'test' })
    },
    {
      methodName: 'count',
      methodExecution: () => model.count()
    },
    {
      methodName: 'countDocuments',
      methodExecution: () => model.countDocuments()
    },
    {
      methodName: 'deleteMany',
      methodExecution: () => model.deleteMany()
    },
    {
      methodName: 'deleteOne',
      methodExecution: () => model.deleteOne()
    },
    {
      methodName: 'distinct',
      methodExecution: () => model.distinct('name')
    },
    {
      methodName: 'estimatedDocumentCount',
      methodExecution: () => model.estimatedDocumentCount()
    },
    {
      methodName: 'exists',
      methodExecution: () => model.exists({})
    },
    {
      methodName: 'find',
      methodExecution: () => model.find()
    },
    {
      methodName: 'findById',
      methodExecution: () => model.findById('61c482f08af38200097790d8')
    },
    {
      methodName: 'findByIdAndDelete',
      methodExecution: () => model.findByIdAndDelete()
    },
    {
      methodName: 'findByIdAndRemove',
      methodExecution: () => model.findByIdAndRemove()
    },
    {
      methodName: 'findByIdAndUpdate',
      methodExecution: () => model.findByIdAndUpdate()
    },
    {
      methodName: 'findOne',
      methodExecution: () => model.findOne()
    },
    {
      methodName: 'findOneAndDelete',
      methodExecution: () => model.findOneAndDelete()
    },
    {
      methodName: 'findOneAndRemove',
      methodExecution: () => model.findOneAndRemove()
    },
    {
      methodName: 'findOneAndReplace',
      methodExecution: () => model.findOneAndReplace()
    },
    {
      methodName: 'findOneAndUpdate',
      methodExecution: () => model.findOneAndUpdate()
    },
    {
      methodName: 'remove',
      methodExecution: () => model.remove()
    },
    {
      methodName: 'replaceOne',
      methodExecution: () => model.replaceOne({ _id: '61c482f08af38200097790d8' }, { name: 'test' })
    },
    {
      methodName: 'updateMany',
      methodExecution: () => model.updateMany()
    },
    {
      methodName: 'updateOne',
      methodExecution: () => model.updateOne()
    },
    {
      methodName: 'where',
      methodExecution: () => model.where()
    }
  ])('should connect to database before calling $methodName', async ({ methodExecution }) => {
    expect(mongoose.connection.readyState).toEqual(mongoose.STATES.disconnected);

    mongooseLazyConnect(connectOnDatabase);

    await expect(methodExecution()).resolves.not.toThrow();

    expect(mongoose.connection.readyState).toEqual(mongoose.STATES.connected);
  });
});
