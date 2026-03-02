// Setup MySQL Users Table
require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupTable() {
    console.log('🔄 Connecting to Railway MySQL...');
    
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('✅ Connected to MySQL!');
        console.log('🔄 Creating users table...');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await connection.execute(createTableQuery);
        console.log('✅ Users table created successfully!');

        // Check if table exists
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('\n📋 Available tables:', tables);

        await connection.end();
        console.log('\n🎉 MySQL setup complete! You can now use signup and login.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

setupTable();
