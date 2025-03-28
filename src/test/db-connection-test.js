const db = require('../db.js'); // Uses your existing db.js

// Test 1: Basic connection check
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ DB Connection Failed:', err.message);
    process.exit(1); // Fail pipeline
  }

  console.log('✅ Connection established to Aiven MySQL');

  // Test 2: Verify critical tables exist
  connection.query(`
    SELECT 
      COUNT(*) AS missing_tables
    FROM 
      information_schema.tables 
    WHERE 
      table_schema = '${process.env.DB_NAME}' AND
      table_name IN ('top_songs', 'artists', 'users')
  `, (error, results) => {
    connection.release();

    if (error || results[0].missing_tables > 0) {
      console.error('❌ Missing required tables');
      process.exit(1);
    }

    console.log('✅ All required tables exist');
    process.exit(0); // Success
  });
});