require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB configuration
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'guvi_profiles'; // Updated to match connection string
const collectionName = 'profiles';

let client = null;
let db = null;

async function getMongoDBConnection() {
    try {
        if (!client) {
            client = new MongoClient(mongoUri);
            await client.connect();
            db = client.db(dbName);
            console.log('✅ MongoDB Connected to:', dbName);
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
            console.log('✅ MongoDB Collection accessed:', collectionName);
            return database.collection(collectionName);
        }
        console.log('⚠️  MongoDB database not available');
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
