const express = require('express');
const cors = require('cors'); // Importing the CORS package
const path = require('path'); // To serve static files
const songsRouter = require('./routes/songs'); // Adjust the path if necessary

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Use express built-in middleware for JSON parsing

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/songs', songsRouter);

// Start the server only if we're not in the test environment
if (process.env.NODE_ENV !== 'test') {
    const port = 5000;
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

module.exports = app;  // Export app for testing
