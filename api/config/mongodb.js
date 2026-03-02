require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB configuration
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'user_profiles_db';
const collectionName = 'profiles';

let client = null;
let db = null;

async function getMongoDBConnection() {
    try {
        if (!client) {
            client = new MongoClient(mongoUri);
            await client.connect();
            db = client.db(dbName);
        }
        return db;
    } catch (error) {
        console.error('MongoDB Connection failed:', error.message);
        return null;
    }
}

async function getMongoCollection() {
    try {
        const database = await getMongoDBConnection();
        if (database) {
            return database.collection(collectionName);
        }
        return null;
    } catch (error) {
        console.error('MongoDB Collection error:', error.message);
        return null;
    }
}

module.exports = {
    getMongoDBConnection,
    getMongoCollection
};
