const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const CONNECTION_STRING = process.env.DATABASE_URL;

async function setupDatabase() {
    if (!CONNECTION_STRING) {
        console.error('DATABASE_URL is missing!');
        return;
    }
    console.log('Connecting to Supabase Database...');
    const client = new Client({
        connectionString: CONNECTION_STRING,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected!');

        const schemaPath = path.join(__dirname, '../schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running Schema...');
        await client.query(schemaSql);
        console.log('Schema applied successfully!');

    } catch (err) {
        console.error('Database Setup Error:', err);
    } finally {
        await client.end();
    }
}

setupDatabase();
