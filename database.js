const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017'; 
const client = new MongoClient(url);
const dbName = 'form';

const dbConnection = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    return db;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { dbConnection };
