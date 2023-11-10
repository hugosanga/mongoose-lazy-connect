import mongoose from 'mongoose';

let executionPromise: Promise<any> | null;

const originalQueryExec = mongoose.Query.prototype.exec;
const originalAggregateExec = mongoose.Aggregate.prototype.exec;
const originalModelSave = mongoose.Model.prototype.save;
const originalModelBulkSave = mongoose.Model.bulkSave;
const originalModelBulkWrite = mongoose.Model.bulkWrite;
const originalModelCreate = mongoose.Model.create;
const originalModelCreateCollection = mongoose.Model.createCollection;
const originalModelEnsureIndexes = mongoose.Model.ensureIndexes;
const originalModelDiffIndexes = mongoose.Model.diffIndexes;
const originalModelInsertMany = mongoose.Model.insertMany;
const originalModelPopulate = mongoose.Model.populate;
const originalModelValidate = mongoose.Model.validate;

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
  mongoose.Model.bulkSave = connectOnDatabaseDecorator(originalModelBulkSave, callback);
  mongoose.Model.bulkWrite = connectOnDatabaseDecorator(originalModelBulkWrite, callback);
  mongoose.Model.create = connectOnDatabaseDecorator(originalModelCreate, callback);
  mongoose.Model.createCollection = connectOnDatabaseDecorator(originalModelCreateCollection, callback);
  mongoose.Model.ensureIndexes = connectOnDatabaseDecorator(originalModelEnsureIndexes, callback);
  mongoose.Model.diffIndexes = connectOnDatabaseDecorator(originalModelDiffIndexes, callback);
  mongoose.Model.insertMany = connectOnDatabaseDecorator(originalModelInsertMany, callback);
  mongoose.Model.populate = connectOnDatabaseDecorator(originalModelPopulate, callback);
  mongoose.Model.validate = connectOnDatabaseDecorator(originalModelValidate, callback);
}
