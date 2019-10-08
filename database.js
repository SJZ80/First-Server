mongoClient = require('mongodb').MongoClient;

// Connection Database

const URL = 'mongodb://localhost:27017';
const DATABASE = 'primer_db';
const client = new mongoClient(URL);

module.exports.DATABASE = DATABASE;
module.exports.client = client;
