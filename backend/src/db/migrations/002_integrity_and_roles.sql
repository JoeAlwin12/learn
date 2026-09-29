-- CRM integrity and security improvements

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'sales',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE process_types
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE deals
  ADD COLUMN IF NOT EXISTS product VARCHAR(255);

-- Preserve historical deals when users are deactivated/deleted.
ALTER TABLE deals DROP CONSTRAINT IF EXISTS deals_primary_owner_id_fkey;
ALTER TABLE deals
  ADD CONSTRAINT deals_primary_owner_id_fkey
  FOREIGN KEY (primary_owner_id) REFERENCES users(id) ON DELETE RESTRICT;

-- A deal must always have a valid process type.
ALTER TABLE deals DROP CONSTRAINT IF EXISTS deals_process_type_id_fkey;
ALTER TABLE deals
  ADD CONSTRAINT deals_process_type_id_fkey
  FOREIGN KEY (process_type_id) REFERENCES process_types(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_deals_product ON deals(product);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_process_types_active ON process_types(is_active);