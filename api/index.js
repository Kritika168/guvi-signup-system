const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');

const app = express();

// Load database configs with error handling
let getMySQLConnection, closeMySQLConnection, getMongoCollection, RedisClient;

try {
    const mysql = require('./config/mysql');
    getMySQLConnection = mysql.getMySQLConnection;
    closeMySQLConnection = mysql.closeMySQLConnection;
} catch (error) {
    console.log('⚠️  MySQL config not loaded');
    getMySQLConnection = async () => null;
    closeMySQLConnection = () => {};
}

try {
    const mongodb = require('./config/mongodb');
    getMongoCollection = mongodb.getMongoCollection;
} catch (error) {
    console.log('⚠️  MongoDB config not loaded');
    getMongoCollection = async () => null;
}

try {
    const redis = require('./config/redis');
    RedisClient = redis.RedisClient;
} catch (error) {
    console.log('⚠️  Redis config not loaded');
    RedisClient = {
        setSession: async () => false,
        getSession: async () => null,
        deleteSession: async () => false,
        validateSession: async () => false
    };
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..')));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.json({ success: false, message: 'All fields are required!' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({ success: false, message: 'Invalid email format!' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.json({ success: false, message: 'Password must be at least 6 characters long!' });
        }

        const connection = await getMySQLConnection();
        if (!connection) {
            return res.json({ success: false, message: 'Database connection failed!' });
        }

        // Check if email exists
        const [emailResults] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (emailResults.length > 0) {
            await closeMySQLConnection(connection);
            return res.json({ success: false, message: 'Email already registered!' });
        }

        // Check if username exists
        const [usernameResults] = await connection.execute(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (usernameResults.length > 0) {
            await closeMySQLConnection(connection);
            return res.json({ success: false, message: 'Username already taken!' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await connection.execute(
            'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())',
            [username, email, hashedPassword]
        );

        const userId = result.insertId;

        // Create initial profile in MongoDB
        try {
            const mongoCollection = await getMongoCollection();
            if (mongoCollection) {
                await mongoCollection.insertOne({
                    userId: userId.toString(),
                    fullName: '',
                    dob: '',
                    age: '',
                    contact: '',
                    address: '',
                    city: '',
                    country: '',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        } catch (mongoError) {
            console.error('MongoDB insert failed:', mongoError);
        }

        await closeMySQLConnection(connection);

        res.json({ success: true, message: 'Registration successful!' });

    } catch (error) {
        console.error('Signup error:', error);
        res.json({ success: false, message: 'An error occurred during registration.' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.json({ success: false, message: 'All fields are required!' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({ success: false, message: 'Invalid email format!' });
        }

        const connection = await getMySQLConnection();
        if (!connection) {
            return res.json({ success: false, message: 'Database connection failed!' });
        }

        // Fetch user
        const [results] = await connection.execute(
            'SELECT id, username, email, password FROM users WHERE email = ?',
            [email]
        );

        if (results.length === 0) {
            await closeMySQLConnection(connection);
            return res.json({ success: false, message: 'Invalid email or password!' });
        }

        const user = results[0];

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            await closeMySQLConnection(connection);
            return res.json({ success: false, message: 'Invalid email or password!' });
        }

        // Generate session token
        const sessionToken = crypto.randomBytes(32).toString('hex');

        // Store session in Redis
        const sessionStored = await RedisClient.setSession(sessionToken, user.id, {
            username: user.username,
            email: user.email
        });

        if (!sessionStored) {
            await closeMySQLConnection(connection);
            return res.json({ success: false, message: 'Failed to create session!' });
        }

        // Update last login
        await connection.execute(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [user.id]
        );

        await closeMySQLConnection(connection);

        res.json({
            success: true,
            message: 'Login successful!',
            sessionToken: sessionToken,
            userId: user.id,
            username: user.username,
            email: user.email
        });

    } catch (error) {
        console.error('Login error:', error);
        res.json({ success: false, message: 'An error occurred during login.' });
    }
});

// Get profile endpoint
app.post('/api/get_profile', async (req, res) => {
    try {
        const { sessionToken, userId } = req.body;

        // Validate input
        if (!sessionToken || !userId) {
            return res.json({ success: false, message: 'Invalid request!' });
        }

        // Validate session
        const isValid = await RedisClient.validateSession(sessionToken, userId);
        if (!isValid) {
            return res.json({ success: false, message: 'Session expired or invalid!' });
        }

        // Fetch profile from MongoDB
        const collection = await getMongoCollection();
        if (!collection) {
            return res.json({ success: false, message: 'Database connection failed!' });
        }

        const profile = await collection.findOne({ userId: userId.toString() });

        if (profile) {
            res.json({
                success: true,
                profile: {
                    fullName: profile.fullName || '',
                    dob: profile.dob || '',
                    age: profile.age || '',
                    contact: profile.contact || '',
                    address: profile.address || '',
                    city: profile.city || '',
                    country: profile.country || ''
                }
            });
        } else {
            res.json({ success: true, profile: null });
        }

    } catch (error) {
        console.error('Get profile error:', error);
        res.json({ success: false, message: 'An error occurred while fetching profile.' });
    }
});

// Update profile endpoint
app.post('/api/update_profile', async (req, res) => {
    try {
        const { sessionToken, userId, fullName, dob, age, contact, address, city, country } = req.body;

        // Validate input
        if (!sessionToken || !userId) {
            return res.json({ success: false, message: 'Invalid request!' });
        }

        // Validate session
        const isValid = await RedisClient.validateSession(sessionToken, userId);
        if (!isValid) {
            return res.json({ success: false, message: 'Session expired or invalid!' });
        }

        // Update profile in MongoDB
        const collection = await getMongoCollection();
        if (!collection) {
            return res.json({ success: false, message: 'Database connection failed!' });
        }

        const updateData = {
            fullName: fullName || '',
            dob: dob || '',
            age: age || '',
            contact: contact || '',
            address: address || '',
            city: city || '',
            country: country || '',
            updatedAt: new Date()
        };

        const result = await collection.updateOne(
            { userId: userId.toString() },
            { $set: updateData },
            { upsert: true }
        );

        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
            res.json({ success: true, message: 'Profile updated successfully!' });
        } else {
            res.json({ success: true, message: 'No changes were made to the profile.' });
        }

    } catch (error) {
        console.error('Update profile error:', error);
        res.json({ success: false, message: 'An error occurred while updating profile.' });
    }
});

// Logout endpoint
app.post('/api/logout', async (req, res) => {
    try {
        const { sessionToken } = req.body;

        if (sessionToken) {
            await RedisClient.deleteSession(sessionToken);
        }

        res.json({ success: true, message: 'Logged out successfully!' });

    } catch (error) {
        console.error('Logout error:', error);
        res.json({ success: true, message: 'Logged out successfully!' });
    }
});

// Export for Vercel
module.exports = app;

// Local development server
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
