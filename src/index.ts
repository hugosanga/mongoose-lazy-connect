import mongoose from 'mongoose';

let executionPromise: Promise<any> | null;

const originalQueryExec = mongoose.Query.prototype.exec;
const originalAggregateExec = mongoose.Aggregate.prototype.exec;
const originalModelSave = mongoose.Model.prototype.save;
const originalModelbulkSave = mongoose.Model.bulkSave;
const originalModelbulkWrite = mongoose.Model.bulkWrite;
const originalModelcreate = mongoose.Model.create;
const originalModelcreateCollection = mongoose.Model.createCollection;
const originalModelensureIndexes = mongoose.Model.ensureIndexes;
const originalModeldiffIndexes = mongoose.Model.diffIndexes;
const originalModelinsertMany = mongoose.Model.insertMany;
const originalModelpopulate = mongoose.Model.populate;
const originalModelvalidate = mongoose.Model.validate;

async function executeCallback(callback: () => Promise<void>): Promise<void> {
  if (!executionPromise)
    executionPromise = (async () => {
      await callback();
      executionPromise = null;
    })();

  return executionPromise;
}

const connectOnDatabaseDecorator = (originalMethod: any, callback: () => Promise<void>): any =>
  async function (this: any, ...args: any[]) {
    const isMongooseDisconnected = mongoose.connection.readyState !== mongoose.STATES.connected;

    if (isMongooseDisconnected) await executeCallback(callback);

    return originalMethod.apply(this, args);
  };

export function mongooseLazyConnect(callback: () => Promise<void>) {
  mongoose.Query.prototype.exec = connectOnDatabaseDecorator(originalQueryExec, callback);
  mongoose.Aggregate.prototype.exec = connectOnDatabaseDecorator(originalAggregateExec, callback);
  mongoose.Model.prototype.save = connectOnDatabaseDecorator(originalModelSave, callback);
  mongoose.Model.bulkSave = connectOnDatabaseDecorator(originalModelbulkSave, callback);
  mongoose.Model.bulkWrite = connectOnDatabaseDecorator(originalModelbulkWrite, callback);
  mongoose.Model.create = connectOnDatabaseDecorator(originalModelcreate, callback);
  mongoose.Model.createCollection = connectOnDatabaseDecorator(originalModelcreateCollection, callback);
  mongoose.Model.ensureIndexes = connectOnDatabaseDecorator(originalModelensureIndexes, callback);
  mongoose.Model.diffIndexes = connectOnDatabaseDecorator(originalModeldiffIndexes, callback);
  mongoose.Model.insertMany = connectOnDatabaseDecorator(originalModelinsertMany, callback);
  mongoose.Model.populate = connectOnDatabaseDecorator(originalModelpopulate, callback);
  mongoose.Model.validate = connectOnDatabaseDecorator(originalModelvalidate, callback);
}
