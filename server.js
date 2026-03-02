#!/usr/bin/env node

const express = require('express');
const app = require('./api/index.js');

const PORT = process.env.PORT || 3000;

console.log('\n========================================');
console.log('  🚀 Starting GUVI User Registration');
console.log('========================================\n');

// Test database connections on startup
async function testConnections() {
    const tests = [];
    
    // Test MySQL
    try {
        const { getMySQLConnection, closeMySQLConnection } = require('./api/config/mysql');
        const conn = await getMySQLConnection();
        if (conn) {
            await closeMySQLConnection(conn);
            console.log('✓ MySQL connected');
            tests.push('MySQL');
        }
    } catch (error) {
        console.log('✗ MySQL not connected:', error.message);
    }

    // Test MongoDB
    try {
        const { getMongoCollection } = require('./api/config/mongodb');
        const collection = await getMongoCollection();
        if (collection) {
            console.log('✓ MongoDB connected');
            tests.push('MongoDB');
        }
    } catch (error) {
        console.log('✗ MongoDB not connected:', error.message);
    }

    // Test Redis
    try {
        const { RedisClient } = require('./api/config/redis');
        if (RedisClient) {
            console.log('✓ Redis connected');
            tests.push('Redis');
        }
    } catch (error) {
        console.log('✗ Redis not connected:', error.message);
    }

    return tests;
}

testConnections().then((connectedServices) => {
    console.log('\n========================================');
    console.log(`  Server running on: http://localhost:${PORT}`);
    console.log('========================================');
    console.log('\n📋 Available Pages:');
    console.log(`  • Signup:  http://localhost:${PORT}/signup.html`);
    console.log(`  • Login:   http://localhost:${PORT}/login.html`);
    console.log(`  • Profile: http://localhost:${PORT}/profile.html`);
    console.log('\n📋 API Endpoints:');
    console.log(`  • Health:  http://localhost:${PORT}/api/health`);
    console.log(`  • Signup:  POST http://localhost:${PORT}/api/signup`);
    console.log(`  • Login:   POST http://localhost:${PORT}/api/login`);
    console.log(`  • Profile: POST http://localhost:${PORT}/api/get_profile`);
    console.log(`  • Update:  POST http://localhost:${PORT}/api/update_profile`);
    console.log(`  • Logout:  POST http://localhost:${PORT}/api/logout`);
    console.log('\n✓ Connected Services: ' + connectedServices.join(', '));
    console.log('\nPress Ctrl+C to stop the server\n');
    
    app.listen(PORT);
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
