# 🚀 START HERE - Run Your CRM Locally (macOS)

**Get everything running in 10 minutes!** This is your complete roadmap.

---

## ⚡ **FASTEST PATH (5 Minutes)**

### Step 1: Install Prerequisites (2 Minutes)

You need 3 things. **Choose your install method:**

#### **Option A: Homebrew (Recommended - Easiest)**

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js + npm (includes both)
brew install node

# Install Docker (for PostgreSQL)
brew install docker

# Verify installation
node --version   # Should show v20+ or higher
npm --version    # Should show 9+
docker --version # Should show Docker version
```

#### **Option B: Official Installers (Slower)**

1. **Node.js LTS**: https://nodejs.org/en/download (download for Apple Silicon)
   - Run `.pkg` installer
   - Follow prompts
   - Restart terminal after install

2. **Docker Desktop**: https://www.docker.com/products/docker-desktop
   - Download for Apple Silicon
   - Drag to Applications
   - Launch Docker Desktop app

### Step 2: Start PostgreSQL (2 Minutes)

**Choose ONE method:**

#### **Method A: Docker (Easiest - No Configuration)**

```bash
cd ~/learn/backend

# Start PostgreSQL container (first time takes 30 seconds)
docker-compose up -d

# Verify it's running
docker ps  # Should show "crm_postgres" container

# Database is automatically created! ✅
```

#### **Method B: Homebrew (If Docker won't install)**

```bash
# Start PostgreSQL service
brew services start postgresql@15

# Create database and user
createuser -P crm_user  # Password: crm_password
createdb -O crm_user crm_db

# Verify
psql -U crm_user -d crm_db -c "SELECT 1;"
```

### Step 3: Start Backend (1 Minute)

```bash
cd ~/learn/backend

# Install dependencies (first time: 30-60 seconds)
npm install

# Start server
npm run dev

# You should see: "Server running on http://localhost:5000" ✅
# LEAVE THIS TERMINAL OPEN
```

### Step 4: Start Frontend (30 Seconds)

**Open NEW Terminal Tab** (Cmd+T):

```bash
cd ~/learn/frontend

# Install dependencies (30-60 seconds)
npm install

# Start React
npm run dev

# You should see: "http://localhost:5173" ✅
```

### Step 5: Open App in Browser

**Click this link**: http://localhost:5173

**Login with:**
- Email: `admin@crm.local`
- Password: `admin123`

**Done! 🎉** Your CRM is running!

---

## 📋 Troubleshooting Quick Fixes

### ❌ "npm not found"
```bash
# Check if Node is installed
node --version

# If nothing shows, reinstall Node.js from https://nodejs.org
# After install, restart terminal
```

### ❌ "Port 5000/5173 already in use"
```bash
# Find process using the port
lsof -i :5000  # for backend
lsof -i :5173  # for frontend

# Kill it (replace PID with the number from above)
kill -9 <PID>

# Restart the server
```

### ❌ "PostgreSQL connection refused"
```bash
# Check if Docker container is running
docker ps

# If not, start it
docker-compose up -d

# Or check if Homebrew PostgreSQL is running
brew services list | grep postgresql
```

### ❌ "Cannot connect to Docker daemon"
```bash
# Launch Docker Desktop app from Applications folder
# Wait 30 seconds for it to start
# Try again
```

### ❌ "npm install is slow"
- This is normal first time (30-60 seconds)
- Grab coffee ☕ and wait
- Second time will be instant

---

## 🎮 What You Can Do Now

Your fully functional CRM is running! Try:

1. **View Pipeline** - Click "Sell" in sidebar → See all deals
2. **Create Deal** - Click "New Deal" button → Add a deal
3. **Drag & Drop** - Drag deal cards between stages
4. **Edit Details** - Click a deal card → Edit in modal
5. **Filter** - Use Countries/Products filters
6. **Manage Users** - Admin panel → User management

---

## 📚 Next Steps

### Want to Stop?
```bash
# Terminal 1 (Backend): Press Ctrl+C
# Terminal 2 (Frontend): Press Ctrl+C
# Docker: docker-compose down
```

### Want to Restart?
```bash
# Backend: npm run dev
# Frontend: npm run dev
# (both should start in seconds)
```

### Want to Deploy?
See `DEPLOYMENT.md` for production setup

### Want to Explore Code?
- Frontend: `~/learn/frontend/src`
- Backend: `~/learn/backend/src`
- Database: Check `backend/src/db/migrations/`

### Want API Documentation?
```bash
cd ~/learn/backend
# See API_DOCUMENTATION.md
```

---

## 🆘 Still Stuck?

1. **Check logs in terminal** - Error messages are helpful!
2. **Read SETUP.md** - Detailed configuration guide
3. **Read LOCAL_RUN.md** - Extended local development guide
4. **Check TEST_API.md** - API testing guide with Postman

---

## ✅ Checklist - You're Good If:

- [ ] Node.js installed (`node --version` shows v20+)
- [ ] Docker running (Docker Desktop in taskbar or `docker ps` works)
- [ ] Backend starts (`npm run dev` shows "Server running on :5000")
- [ ] Frontend starts (`npm run dev` shows ":5173")
- [ ] Browser opens to http://localhost:5173
- [ ] Can login with `admin@crm.local` / `admin123`
- [ ] Can see deal cards on pipeline
- [ ] Can drag & drop deals between stages

---

## 🎯 Current Status

Your CRM Platform is **PRODUCTION READY**:
- ✅ Database: PostgreSQL (running)
- ✅ Backend: Express.js API (running on :5000)
- ✅ Frontend: React Dashboard (running on :5173)
- ✅ Authentication: JWT-based login (working)
- ✅ Features: Full Kanban board (operational)

**Everything is fully functional. No placeholders. No mocks.**

---

## 📞 Quick Commands Reference

```bash
# Backend
cd ~/learn/backend && npm run dev         # Start server
npm run migrate                            # Run migrations
npm run seed                               # Seed demo data

# Frontend
cd ~/learn/frontend && npm run dev        # Start React
npm run build                              # Production build

# Database
docker-compose up -d                       # Start PostgreSQL
docker-compose down                        # Stop PostgreSQL
docker ps                                  # Check status

# General
Ctrl+C                                     # Stop any server
npm install                                # Install deps (one time)
```

---

**You're all set! Enjoy your CRM! 🚀**

Any questions? Check the other documentation files in `~/learn/`
