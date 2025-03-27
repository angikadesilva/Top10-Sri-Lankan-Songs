const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Initial connection attempt
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database!');
});

// Reconnection logic for when the connection is lost
db.on('error', (err) => {
  console.error('Database connection lost:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    // Reconnect the database connection
    db.connect((err) => {
      if (err) {
        console.error('Error reconnecting to the database:', err);
        return;
      }
      console.log('Reconnected to the database!');
    });
  } else {
    // Handle other errors
    console.error('Unhandled database error:', err);
  }
});

module.exports = db;
