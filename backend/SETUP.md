# Backend Setup Guide

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v15+) OR Docker

## Option 1: Setup with Docker (Recommended)

### Requirements
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Steps

1. **Start PostgreSQL container:**
```bash
cd ~/learn/backend
docker-compose up -d
```

This will start a PostgreSQL container with:
- Database: `crm_db`
- User: `postgres`
- Password: `postgres`
- Port: `5432`

2. **Verify the container is running:**
```bash
docker-compose ps
```

3. **Continue to "Run Migrations"**

---

## Option 2: Local PostgreSQL Installation (macOS with Homebrew)

### Prerequisites
- Install [Homebrew](https://brew.sh/)

### Steps

1. **Install PostgreSQL:**
```bash
brew install postgresql@15
```

2. **Start PostgreSQL service:**
```bash
brew services start postgresql@15
```

3. **Create database and user:**
```bash
createdb crm_db
psql crm_db
```

Then in psql:
```sql
CREATE USER postgres WITH PASSWORD 'postgres';
ALTER USER postgres CREATEDB;
\q
```

4. **Update .env file** if your credentials are different:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/crm_db
```

5. **Continue to "Run Migrations"**

---

## Run Migrations & Seed Data

Once PostgreSQL is running:

### 1. Install Dependencies
```bash
cd ~/learn/backend
npm install
```

### 2. Run Migrations
```bash
npm run migrate
```

Expected output:
```
Running migrations...
✓ Migrations completed successfully
```

### 3. Seed Sample Data
```bash
npm run seed
```

Expected output:
```
Starting database seed...
✓ Users created
✓ Process types created
✓ Deals created
✓ Team members assigned
✓ Database seeded successfully!
```

---

## Start Development Server

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will run on: `http://localhost:5000`

Check health: `curl http://localhost:5000/health`

---

## Database Schema

### Tables

**users**
- id (UUID, Primary Key)
- username (VARCHAR, Unique)
- email (VARCHAR, Unique)
- password_hash (VARCHAR)
- full_name (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**process_types**
- id (UUID, Primary Key)
- name (VARCHAR, Unique)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**deals**
- id (UUID, Primary Key)
- company_name (VARCHAR)
- location (VARCHAR)
- deal_value (DECIMAL)
- stage (VARCHAR) - Values: interested, requirement_confirmed, proposal_sent, negotiation, closed_won, closed_lost
- process_type_id (UUID, Foreign Key)
- primary_owner_id (UUID, Foreign Key)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**deal_team_members**
- id (UUID, Primary Key)
- deal_id (UUID, Foreign Key)
- user_id (UUID, Foreign Key)
- created_at (TIMESTAMP)
- Constraint: UNIQUE(deal_id, user_id)

---

## Sample Data After Seeding

### Users
- **joe** / joe@quantic.com (password: password123)
- **senthil** / senthil@quantic.com (password: password123)
- **cto_viewer** / cto@quantic.com (password: password123)

### Process Types
- Private
- PSU — Relationship
- PSU — Tender

### Sample Deals (9 total)
- JSW Cement — Nandyal (₹50L)
- Adani Ports — Mundra (₹75L)
- Reliance Industries — Jamnagar (₹85L)
- Vedanta Aluminium — Jharsuguda (₹3.1Cr)
- Hindalco Industries — Renukoot (₹2.65Cr)
- Tata Power — Mundra Plant (₹4.2Cr)
- JSPL — Angul (₹5.2Cr)
- NTPC — Ramagundam (₹4.5Cr) - CLOSED WON
- Steel Authority of India — Rourkela (₹3.5Cr) - CLOSED LOST

---

## Troubleshooting

### Can't connect to database
1. Verify PostgreSQL is running: `psql -U postgres -d crm_db -c "SELECT version();"`
2. Check DATABASE_URL in `.env` file
3. Ensure port 5432 is not in use

### Docker issues
```bash
# View logs
docker-compose logs postgres

# Stop container
docker-compose down

# Remove all data and restart fresh
docker-compose down -v
docker-compose up -d
```

### Migration failed
- Check if database exists and is accessible
- Ensure PostgreSQL version is 15+
- Check logs for SQL errors

### Reset database
```bash
npm run migrate  # Re-run migrations
npm run seed     # Re-seed data
```

---

## Next Phase

Once backend is set up and running, proceed to Phase 2: Backend API Development
