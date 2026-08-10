const { Client } = require('pg');
const fs = require('fs');

const MIGRATION = fs.readFileSync(__dirname + '/../supabase/migrations/00001_initial_schema.sql', 'utf8');
const SEED = fs.readFileSync(__dirname + '/../supabase/seed.sql', 'utf8');

async function run() {
  // Connection using Supabase session pooler
  const configs = [
    {
      name: 'Session Pooler',
      host: process.env.SUPABASE_DB_HOST || 'aws-0-ap-southeast-1.pooler.supabase.com',
      port: parseInt(process.env.SUPABASE_DB_PORT || '6543'),
      user: process.env.SUPABASE_DB_USER || '',
      password: process.env.SUPABASE_DB_PASSWORD || '',
    },
    {
      name: 'Direct',
      host: process.env.SUPABASE_DB_DIRECT_HOST || 'db.alpeldmxyjxskjebvzbt.supabase.co',
      port: parseInt(process.env.SUPABASE_DB_DIRECT_PORT || '5432'),
      user: process.env.SUPABASE_DB_DIRECT_USER || 'postgres',
      password: process.env.SUPABASE_DB_DIRECT_PASSWORD || '',
    },
  ];

  for (const cfg of configs) {
    const client = new Client({
      ...cfg,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    });

    try {
      console.log(`Trying ${cfg.name} connection...`);
      await client.connect();
      console.log(`✅ Connected via ${cfg.name}`);

      console.log('Running migration...');
      await client.query(MIGRATION);
      console.log('✅ Schema created (9 tables + RLS policies)');

      console.log('Running seed data...');
      await client.query(SEED);
      console.log('✅ Seed data inserted (13 shops)');

      const { rows } = await client.query('SELECT count(*) as c FROM shops');
      console.log(`✅ Verified: ${rows[0].c} shops in database`);

      // Insert sample products
      await client.query(`
        INSERT INTO shop_products (shop_id, name, category, price, delivery_available)
        SELECT id, '皇家小型犬成犬粮 2kg', 'food', 128, true FROM shops WHERE name = '萌爪宠物生活馆';
        INSERT INTO shop_products (shop_id, name, category, price, delivery_available)
        SELECT id, '比瑞吉天然猫粮 1.5kg', 'food', 89, true FROM shops WHERE name = '萌爪宠物生活馆';
        INSERT INTO shop_products (shop_id, name, category, price, delivery_available)
        SELECT id, '宠物尿垫 50片装', 'supplies', 35, true FROM shops WHERE name = '萌爪宠物生活馆';
        INSERT INTO shop_products (shop_id, name, category, price, delivery_available)
        SELECT id, '狗狗磨牙棒 10根装', 'food', 25, true FROM shops WHERE name = '萌爪宠物生活馆';
        INSERT INTO shop_products (shop_id, name, category, price, delivery_available)
        SELECT id, '冠能幼犬粮 1.5kg', 'food', 98, true FROM shops WHERE name = '汪星人宠物店';
        INSERT INTO shop_products (shop_id, name, category, price, delivery_available)
        SELECT id, '狗狗牵引绳 反光款', 'supplies', 39, true FROM shops WHERE name = '汪星人宠物店';
        INSERT INTO shop_products (shop_id, name, category, price, delivery_available)
        SELECT id, '小型犬精致洗护', 'service', 88, false FROM shops WHERE name = '狗狗秀宠物美容';
        INSERT INTO shop_products (shop_id, name, category, price, delivery_available)
        SELECT id, '大型犬全套美容', 'service', 168, false FROM shops WHERE name = '狗狗秀宠物美容';
        INSERT INTO shop_products (shop_id, name, category, price, delivery_available)
        SELECT id, '猫咪专业洗护', 'service', 128, false FROM shops WHERE name = '狗狗秀宠物美容';
        INSERT INTO shop_products (shop_id, name, category, price, delivery_available)
        SELECT id, '宠物基础体检', 'service', 68, false FROM shops WHERE name = '商丘爱宠宠物医院';
        INSERT INTO shop_products (shop_id, name, category, price, delivery_available)
        SELECT id, '狂犬疫苗注射', 'service', 80, false FROM shops WHERE name = '商丘爱宠宠物医院';
        INSERT INTO shop_products (shop_id, name, category, price, delivery_available)
        SELECT id, '体外驱虫', 'service', 50, false FROM shops WHERE name = '商丘爱宠宠物医院';
      `);
      console.log('✅ Sample products inserted (12 items)');

      await client.end();
      console.log('🎉 All done! Database is ready.');
      return;
    } catch (err) {
      console.log(`❌ ${cfg.name} failed: ${err.message}`);
      try { await client.end(); } catch {}
    }
  }

  console.error('\n❌ All connection attempts failed.');
  console.error('Please provide the database password from:');
  console.error('Supabase Dashboard → Settings → Database → Connection string');
  console.error('Look for: postgresql://postgres:[PASSWORD]@db...');
}

run();
