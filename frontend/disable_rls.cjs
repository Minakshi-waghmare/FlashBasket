const { Client } = require('pg');

const client = new Client({
  host: 'aws-1-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.drpycecnpepgwtawpoan',
  password: 'FlashBasket@321',
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully!');
    
    // Disable RLS on the wishlist, address, carts, and other tables
    const queries = [
      'ALTER TABLE wishlist DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE address DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE carts DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE users DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE product DISABLE ROW LEVEL SECURITY;'
    ];
    
    for (const query of queries) {
      console.log(`Executing: ${query}`);
      await client.query(query);
    }
    
    console.log('Successfully disabled Row-Level Security (RLS) on all tables!');
  } catch (err) {
    console.error('Error disabling RLS:', err);
  } finally {
    await client.end();
  }
}

run();
