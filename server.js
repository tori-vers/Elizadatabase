// Import required modules
const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');

// Create Express application
const app = express();
const port = 3306;

// Serve static files from the public directory
app.use(express.static('public', {
    index: 'login.html',
    extensions: ['html', 'js'], // Allow serving .js files
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'text/javascript');
        }
    }
}));

// Parse JSON requests
app.use(express.json());

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // MySQL username
    password: 'toor', // MySQL password
    database: 'chatbot_db' // db name 
});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ', err);
        return;
    }
    console.log('Connected to MySQL Database!');
});

// Register endpoint
app.post('/register', (req, res) => {
    console.log('Received registration request:', req.body);

    const { username, password } = req.body;

    // Check if username already exists
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    connection.query(checkQuery, [username], (error, results) => {
        if (error) {
            console.error('Error checking username: ', error);
            res.status(500).json({ success: false, message: 'Username already exists' });
            return;
        }

        // Insert new user into database
        const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
        connection.query(insertQuery, [username, password], (error, results) => {
            if (error) {
                console.error('Error registering user: ', error);
                res.status(500).json({ success: false, message: 'Error registering user' });
                return;
            }
            console.log('User registered successfully:', username);
            res.json({ success: true, message: 'User registered successfully' });
        });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    console.log('Received login request:', req.body);

    const { username, password } = req.body;

    // Authenticate user
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.query(query, [username, password], (error, results) => {
        if (error) {
            console.error('Error authenticating user: ', error);
            res.status(500).json({ success: false, message: 'Error authenticating user' });
            return;
        }
        if (results.length === 0) {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
            return;
        }
        console.log('User authenticated successfully:', username);
        res.json({ success: true, message: 'User authenticated successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
