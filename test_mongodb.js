// Test MongoDB Connection
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testMongoDB() {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    try {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        
        console.log('✅ Connected to MongoDB Atlas!');
        
        // Test database access
        const db = client.db('guvi_profiles');
        const collections = await db.listCollections().toArray();
        
        console.log('📋 Database: guvi_profiles');
        console.log('📋 Collections:', collections.length > 0 ? collections.map(c => c.name) : 'None yet (will be created automatically)');
        
        await client.close();
        console.log('\n🎉 MongoDB setup complete! Ready for profile storage.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testMongoDB();
