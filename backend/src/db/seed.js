const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seed...');
    
    // Clear existing data
    await client.query('TRUNCATE TABLE deal_team_members CASCADE');
    await client.query('TRUNCATE TABLE deals CASCADE');
    await client.query('TRUNCATE TABLE process_types CASCADE');
    await client.query('TRUNCATE TABLE users CASCADE');
    
    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      {
        id: uuidv4(),
        username: 'joe',
        email: 'joe@quantic.com',
        password_hash: hashedPassword,
        full_name: 'Joe'
      },
      {
        id: uuidv4(),
        username: 'senthil',
        email: 'senthil@quantic.com',
        password_hash: hashedPassword,
        full_name: 'Senthil'
      },
      {
        id: uuidv4(),
        username: 'cto_viewer',
        email: 'cto@quantic.com',
        password_hash: hashedPassword,
        full_name: 'CTO Viewer'
      }
    ];
    
    for (const user of users) {
      await client.query(
        'INSERT INTO users (id, username, email, password_hash, full_name) VALUES ($1, $2, $3, $4, $5)',
        [user.id, user.username, user.email, user.password_hash, user.full_name]
      );
    }
    
    console.log('✓ Users created');
    
    // Create process types
    const processTypes = [
      { name: 'Private', description: 'Private sales process' },
      { name: 'PSU — Relationship', description: 'PSU relationship-based process' },
      { name: 'PSU — Tender', description: 'PSU tender-based process' }
    ];
    
    const processTypeIds = [];
    for (const pt of processTypes) {
      const id = uuidv4();
      await client.query(
        'INSERT INTO process_types (id, name, description) VALUES ($1, $2, $3)',
        [id, pt.name, pt.description]
      );
      processTypeIds.push({ id, name: pt.name });
    }
    
    console.log('✓ Process types created');
    
    // Create sample deals
    const deals = [
      {
        company_name: 'JSW Cement — Nandyal',
        location: 'Nandyal, Andhra Pradesh',
        deal_value: 5000000,
        stage: 'interested',
        process_type_id: processTypeIds[0].id,
        primary_owner_id: users[0].id
      },
      {
        company_name: 'Adani Ports — Mundra',
        location: 'Mundra, Gujarat',
        deal_value: 7500000,
        stage: 'interested',
        process_type_id: processTypeIds[0].id,
        primary_owner_id: users[0].id
      },
      {
        company_name: 'Reliance Industries — Jamnagar',
        location: 'Jamnagar, Gujarat',
        deal_value: 8500000,
        stage: 'interested',
        process_type_id: processTypeIds[0].id,
        primary_owner_id: users[0].id
      },
      {
        company_name: 'Vedanta Aluminium — Jharsuguda',
        location: 'Jharsuguda, Odisha',
        deal_value: 31000000,
        stage: 'proposal_sent',
        process_type_id: processTypeIds[0].id,
        primary_owner_id: users[1].id
      },
      {
        company_name: 'Hindalco Industries — Renukoot',
        location: 'Renukoot, UP',
        deal_value: 26500000,
        stage: 'proposal_sent',
        process_type_id: processTypeIds[0].id,
        primary_owner_id: users[0].id
      },
      {
        company_name: 'Tata Power — Mundra Plant',
        location: 'Mundra, Gujarat',
        deal_value: 42000000,
        stage: 'negotiation',
        process_type_id: processTypeIds[0].id,
        primary_owner_id: users[0].id
      },
      {
        company_name: 'JSPL — Angul',
        location: 'Angul, Odisha',
        deal_value: 52000000,
        stage: 'negotiation',
        process_type_id: processTypeIds[0].id,
        primary_owner_id: users[1].id
      },
      {
        company_name: 'NTPC — Ramagundam',
        location: 'Ramagundam, Telangana',
        deal_value: 45000000,
        stage: 'closed_won',
        process_type_id: processTypeIds[0].id,
        primary_owner_id: users[0].id
      },
      {
        company_name: 'Steel Authority of India — Rourkela',
        location: 'Rourkela, Odisha',
        deal_value: 35000000,
        stage: 'closed_lost',
        process_type_id: processTypeIds[0].id,
        primary_owner_id: users[1].id
      }
    ];
    
    const dealIds = [];
    for (const deal of deals) {
      const id = uuidv4();
      await client.query(
        'INSERT INTO deals (id, company_name, location, deal_value, stage, process_type_id, primary_owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, deal.company_name, deal.location, deal.deal_value, deal.stage, deal.process_type_id, deal.primary_owner_id]
      );
      dealIds.push(id);
    }
    
    console.log('✓ Deals created');
    
    // Add some team members to deals
    for (let i = 0; i < dealIds.length; i++) {
      // Add primary owner as team member
      await client.query(
        'INSERT INTO deal_team_members (deal_id, user_id) VALUES ($1, $2)',
        [dealIds[i], deals[i].primary_owner_id]
      );
      
      // Add a secondary team member
      const secondaryOwnerId = deals[i].primary_owner_id === users[0].id ? users[1].id : users[0].id;
      if (i % 2 === 0) {
        await client.query(
          'INSERT INTO deal_team_members (deal_id, user_id) VALUES ($1, $2)',
          [dealIds[i], secondaryOwnerId]
        );
      }
    }
    
    console.log('✓ Team members assigned');
    
    console.log('✓ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedDatabase();
