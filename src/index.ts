import mongoose from 'mongoose';

let executionPromise: Promise<any>;

async function executeCallback(callback: () => Promise<void>): Promise<void> {
  if (!executionPromise) executionPromise = callback();

  return executionPromise;
}

const connectOnDatabaseDecorator = (originalMethod: any, callback: () => Promise<void>): any =>
  async function (this: any, ...args: any[]) {
    const isMongooseDisconnected = mongoose.connection.readyState !== mongoose.STATES.connected;

    if (isMongooseDisconnected) await executeCallback(callback);

    return originalMethod.apply(this, args);
  };

export function mongooseLazyConnect(callback: () => Promise<void>) {
  mongoose.Query.prototype.exec = connectOnDatabaseDecorator(mongoose.Query.prototype.exec, callback);
  mongoose.Aggregate.prototype.exec = connectOnDatabaseDecorator(mongoose.Aggregate.prototype.exec, callback);
  mongoose.Model.prototype.save = connectOnDatabaseDecorator(mongoose.Model.prototype.save, callback);
  mongoose.Model.bulkSave = connectOnDatabaseDecorator(mongoose.Model.bulkSave, callback);
  mongoose.Model.bulkWrite = connectOnDatabaseDecorator(mongoose.Model.bulkWrite, callback);
  mongoose.Model.create = connectOnDatabaseDecorator(mongoose.Model.create, callback);
  mongoose.Model.createCollection = connectOnDatabaseDecorator(mongoose.Model.createCollection, callback);
  mongoose.Model.ensureIndexes = connectOnDatabaseDecorator(mongoose.Model.ensureIndexes, callback);
  mongoose.Model.diffIndexes = connectOnDatabaseDecorator(mongoose.Model.diffIndexes, callback);
  mongoose.Model.insertMany = connectOnDatabaseDecorator(mongoose.Model.insertMany, callback);
  mongoose.Model.populate = connectOnDatabaseDecorator(mongoose.Model.populate, callback);
  mongoose.Model.validate = connectOnDatabaseDecorator(mongoose.Model.validate, callback);
}
