-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create process_types table
CREATE TABLE IF NOT EXISTS process_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  deal_value DECIMAL(15, 2) NOT NULL,
  stage VARCHAR(50) NOT NULL DEFAULT 'interested',
  process_type_id UUID NOT NULL REFERENCES process_types(id) ON DELETE SET NULL,
  primary_owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create deal_team_members table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS deal_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(deal_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_deals_process_type ON deals(process_type_id);
CREATE INDEX IF NOT EXISTS idx_deals_primary_owner ON deals(primary_owner_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deal_team_members_deal ON deal_team_members(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_team_members_user ON deal_team_members(user_id);
