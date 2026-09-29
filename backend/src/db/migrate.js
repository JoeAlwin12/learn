const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('Running migrations...');
    
    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '001_create_tables.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    
    // Execute migration
    await client.query(sql);
    
    console.log('✓ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    client.release();
  }
}

runMigrations();
