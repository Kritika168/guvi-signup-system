require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB configuration
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'guvi_profiles'; // Updated to match connection string
const collectionName = 'profiles';

let client = null;
let db = null;
let isConnecting = false;

async function getMongoDBConnection() {
    try {
        // If already connected, return existing connection
        if (client && client.topology && client.topology.isConnected()) {
            return db;
        }

        // If currently connecting, wait a bit and retry
        if (isConnecting) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return db;
        }

        // Start new connection
        isConnecting = true;
        
        // Close existing client if any
        if (client) {
            try {
                await client.close();
            } catch (e) {
                // Ignore close errors
            }
        }

        client = new MongoClient(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        await client.connect();
        db = client.db(dbName);
        isConnecting = false;
        console.log('✅ MongoDB Connected to:', dbName);
        return db;
    } catch (error) {
        isConnecting = false;
        console.error('❌ MongoDB Connection failed:', error.message);
        return null;
    }
}

async function getMongoCollection() {
    try {
        const database = await getMongoDBConnection();
        if (database) {
            return database.collection(collectionName);
        }
        console.log('⚠️  MongoDB database not available');
        return null;
    } catch (error) {
        console.error('❌ MongoDB Collection error:', error.message);
        return null;
    }
}

module.exports = {
    getMongoDBConnection,
    getMongoCollection
};
