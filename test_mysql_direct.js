require('dotenv').config();
const mysql = require('mysql2/promise');

console.log('Testing MySQL Connection...\n');
console.log('Configuration:');
console.log('  Host:', process.env.DB_HOST);
console.log('  Port:', process.env.DB_PORT);
console.log('  User:', process.env.DB_USER);
console.log('  Database:', process.env.DB_NAME);
console.log('  Password:', process.env.DB_PASS ? '***' + process.env.DB_PASS.slice(-4) : 'NOT SET');
console.log('\nConnecting...\n');

async function testConnection() {
    let connection;
    try {
        // Test connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            connectTimeout: 10000
        });

        console.log('✓ Connected successfully!');
        
        // Test query
        const [rows] = await connection.query('SELECT 1 as test');
        console.log('✓ Query test passed:', rows);

        // Check if users table exists
        const [tables] = await connection.query('SHOW TABLES');
        console.log('\nAvailable tables:', tables);

        console.log('\n✓ All tests passed!');
    } catch (error) {
        console.error('✗ Connection failed!');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

testConnection();
