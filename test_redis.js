// Test Redis Connection
require('dotenv').config();
const redis = require('redis');

async function testRedis() {
    console.log('🔄 Connecting to Redis Cloud...');
    
    try {
        const client = redis.createClient({
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            },
            password: process.env.REDIS_PASSWORD
        });

        client.on('error', (err) => {
            console.error('❌ Redis Client Error:', err);
        });

        await client.connect();
        console.log('✅ Connected to Redis Cloud!');
        
        // Test set and get
        await client.set('test_key', 'Hello Redis!');
        const value = await client.get('test_key');
        console.log('📋 Test value:', value);
        
        // Clean up
        await client.del('test_key');
        await client.quit();
        
        console.log('\n🎉 Redis setup complete! Ready for session management.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testRedis();
