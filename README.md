# mongoose-lazy-connect

[![npm version](https://badge.fury.io/js/mongoose-lazy-connect.svg)](https://www.npmjs.com/package/mongoose-lazy-connect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<br>

`mongoose-lazy-connect` is a Node.js package for lazy connection handling with Mongoose. It allows you to defer the database connection until just before the first query, preventing unnecessary connections when not needed.

This becomes particularly useful in scenarios such as serverless environments, where execution might be resolved through cached data or processing that doesn't require database interaction. By using this library, you can ensure that the connection to the database is only opened when truly needed, minimizing unnecessary resource utilization.

## Installation

Install the package using npm:

```
npm install mongoose-lazy-connect
```

Or yarn:

```
yarn add mongoose-lazy-connect
```

## Usage
```javascript
const mongoose = require('mongoose');
const { mongooseLazyConnect } = require('mongoose-lazy-connect');

// Use mongooseLazyConnect to configure the connection
mongooseLazyConnect(() => {
  // Configure your mongoose connection here
  mongoose.connect('mongodb://localhost:27017/your-database', { useNewUrlParser: true, useUnifiedTopology: true });
});

// Use mongoose models as usual
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
}));

// Perform queries when needed
User.find({}).then(users => {
  console.log(users);
});
```

## Important Notes
`mongoose-lazy-connect` is designed to seamlessly handle Mongoose connections just before executing the first query. It works specifically with Mongoose models. If you attempt to access the database directly using `mongoose.connection.db.collection(...)`, it will not work.

The library supports the following Mongoose model methods, ensuring that the connection is established at the right time:

* `aggregate`
* `save`
* `bulkSave`
* `bulkWrite`
* `create`
* `createCollection`
* `createIndexes`
* `ensureIndexes`
* `diffIndexes`
* `insertMany`
* `populate`
* `validate`
* `count`
* `countDocuments`
* `deleteMany`
* `deleteOne`
* `distinct`
* `estimatedDocumentCount`
* `exists`
* `find`
* `findById`
* `findByIdAndDelete`
* `findByIdAndRemove`
* `findByIdAndUpdate`
* `findOne`
* `findOneAndDelete`
* `findOneAndRemove`
* `findOneAndReplace`
* `findOneAndUpdate`
* `remove`
* `replaceOne`
* `updateMany`
* `updateOne`
* `where`
  
Ensure that you use these methods and work with Mongoose models when interacting with the database to take full advantage of the lazy connection handling provided by mongoose-lazy-connect.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
