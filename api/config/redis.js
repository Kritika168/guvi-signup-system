require('dotenv').config();
const redis = require('redis');

// Redis configuration
const redisConfig = {
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT) || 6379
    }
};

// Add password if provided
if (process.env.REDIS_PASSWORD) {
    redisConfig.password = process.env.REDIS_PASSWORD;
}

let redisClient = null;

async function getRedisConnection() {
    try {
        if (!redisClient) {
            redisClient = redis.createClient(redisConfig);
            
            redisClient.on('error', (err) => {
                console.error('Redis Client Error:', err);
            });
            
            await redisClient.connect();
        }
        return redisClient;
    } catch (error) {
        console.error('Redis Connection failed:', error.message);
        return null;
    }
}

const SESSION_PREFIX = 'session:';
const SESSION_EXPIRY = parseInt(process.env.SESSION_EXPIRY) || 3600;

class RedisClient {
    static async setSession(sessionToken, userId, data = {}) {
        const client = await getRedisConnection();
        if (!client) return false;

        try {
            const sessionData = {
                userId: userId,
                createdAt: Date.now(),
                ...data
            };

            const key = SESSION_PREFIX + sessionToken;
            await client.setEx(key, SESSION_EXPIRY, JSON.stringify(sessionData));
            return true;
        } catch (error) {
            console.error('Redis setSession failed:', error.message);
            return false;
        }
    }

    static async getSession(sessionToken) {
        const client = await getRedisConnection();
        if (!client) return null;

        try {
            const key = SESSION_PREFIX + sessionToken;
            const data = await client.get(key);
            
            if (data) {
                return JSON.parse(data);
            }
            return null;
        } catch (error) {
            console.error('Redis getSession failed:', error.message);
            return null;
        }
    }

    static async deleteSession(sessionToken) {
        const client = await getRedisConnection();
        if (!client) return false;

        try {
            const key = SESSION_PREFIX + sessionToken;
            await client.del(key);
            return true;
        } catch (error) {
            console.error('Redis deleteSession failed:', error.message);
            return false;
        }
    }

    static async validateSession(sessionToken, userId) {
        const sessionData = await this.getSession(sessionToken);
        
        if (sessionData && sessionData.userId == userId) {
            return true;
        }
        return false;
    }
}

module.exports = {
    getRedisConnection,
    RedisClient
};
