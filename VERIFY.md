# ✅ VERIFICATION GUIDE - Confirm Everything Works

**Use this checklist to verify your CRM is working correctly.**

---

## 🔍 Step 1: Verify Prerequisites

### Check Node.js Installation
```bash
node --version
# Should show: v20.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

**If not installed:**
- Download from https://nodejs.org/en/download
- Choose "LTS" version for macOS
- Run `.pkg` installer
- Restart terminal

---

### Check Docker Installation
```bash
docker --version
# Should show: Docker version 24.x.x or higher

docker ps
# Should show list of containers (might be empty)
```

**If Docker not found:**
- Download Docker Desktop from https://www.docker.com/products/docker-desktop
- Choose "Apple Silicon" version
- Drag to Applications folder
- Launch Docker Desktop app
- Wait 30 seconds for it to start
- Try again

---

## 🔍 Step 2: Verify Database

### Start PostgreSQL
```bash
# Method A: Docker (Recommended)
cd ~/learn/backend
docker-compose up -d

# Verify running
docker ps
# Should show container named "crm_postgres" with status "Up"
```

### Check Database Connection
```bash
# Wait 5 seconds for container to fully start
sleep 5

# Try connecting (password: postgres)
docker exec -it crm_postgres psql -U postgres -d crm_db -c "SELECT 1;"
# Should return: 
#  ?column?
# ----------
#        1
```

**If connection fails:**
```bash
# Check logs
docker logs crm_postgres

# Restart container
docker-compose down
docker-compose up -d

# Wait 10 seconds and try again
```

---

## 🔍 Step 3: Verify Backend

### Install Dependencies
```bash
cd ~/learn/backend
npm install
# First time takes 30-60 seconds
# Should end with "added X packages"
```

### Start Backend Server
```bash
cd ~/learn/backend
npm run dev

# You should see:
# ✓ Server running on http://localhost:5000
# ✓ Database connected
```

**If server doesn't start:**
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process (replace PID with actual number)
kill -9 <PID>

# Try starting again
npm run dev
```

### Test Backend API
**Open NEW Terminal** (keep backend running):

```bash
# Test API health
curl http://localhost:5000/api/health

# Should return:
# {"status":"ok","timestamp":"..."}

# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.local","password":"admin123"}'

# Should return:
# {"token":"eyJ...", "user": {...}}
```

---

## 🔍 Step 4: Verify Frontend

### Install Dependencies
**Open NEW Terminal**:

```bash
cd ~/learn/frontend
npm install
# Takes 30-60 seconds
# Should end with "added X packages"
```

### Start Frontend Server
```bash
cd ~/learn/frontend
npm run dev

# You should see:
# ✓ Localhost: http://localhost:5173
# ✓ Ready in XXXms
```

**If server doesn't start:**
```bash
# Check if port 5173 is in use
lsof -i :5173

# Kill the process
kill -9 <PID>

# Try starting again
npm run dev
```

---

## 🔍 Step 5: Verify Frontend in Browser

### Open Application
1. **Click this link:** http://localhost:5173
2. Browser should open CRM login page

### Login Test
- **Email:** `admin@crm.local`
- **Password:** `admin123`
- Should see dashboard with Kanban board

### Verify Features
- [ ] **Login works** - Can log in and see dashboard
- [ ] **Sidebar loads** - See "Sell" menu
- [ ] **Kanban board displays** - See 6 columns (Interested, Requirement, Proposal, Negotiation, Closed Won, Closed Lost)
- [ ] **Deal cards show** - See deal cards with company names, locations, values
- [ ] **Filters work** - Click "Countries" dropdown, see countries
- [ ] **New Deal button** - Click "New Deal" button, form appears
- [ ] **Drag & Drop works** - Drag deal card to another column

---

## 🔍 Step 6: Verify Database Seeding

### Check Seed Data
```bash
# List all deals
docker exec -it crm_postgres psql -U postgres -d crm_db -c "\
SELECT company_name, location, deal_value, stage FROM deals LIMIT 5;"

# Should show:
#  company_name    | location | deal_value | stage
# -----------------+----------+------------+-------
#  Acme Corp      | NYC      |    50000   | interested
#  ...
```

---

## 📋 Full Verification Checklist

Print this and check off as you go:

```
PREREQUISITES
  [ ] Node.js installed (v20+)
  [ ] npm installed (v9+)
  [ ] Docker Desktop installed and running

DATABASE
  [ ] PostgreSQL container running (docker ps shows crm_postgres)
  [ ] Can connect to database
  [ ] Tables created (SELECT 1 returns 1)

BACKEND
  [ ] npm install succeeds
  [ ] npm run dev starts (shows "Server running on :5000")
  [ ] API health check works (curl :5000/api/health returns ok)
  [ ] Login endpoint works (curl POST returns token)

FRONTEND
  [ ] npm install succeeds
  [ ] npm run dev starts (shows "Localhost: :5173")
  [ ] Browser opens to http://localhost:5173
  [ ] Can login with admin@crm.local / admin123
  [ ] Dashboard loads
  [ ] Kanban board displays
  [ ] Deal cards visible
  [ ] Filters work
  [ ] Drag & drop works
  [ ] New Deal button works
```

---

## 🆘 Troubleshooting Matrix

### Issue: "npm install is slow"
- **Expected behavior** - First install takes 30-60 seconds
- **Solution:** Wait. Grab coffee ☕. This is normal.

### Issue: "port 5000/5173 already in use"
```bash
# Find process
lsof -i :5000  # or :5173

# Kill it
kill -9 <PID>

# Restart
npm run dev
```

### Issue: "Cannot connect to Docker daemon"
- Launch Docker Desktop from Applications folder
- Wait 30 seconds for it to fully start
- Run: `docker ps` - should work now

### Issue: "psql: could not connect to server"
```bash
# Container might not be ready yet
# Wait 10 seconds
sleep 10

# Try again
docker exec -it crm_postgres psql -U postgres -d crm_db -c "SELECT 1;"
```

### Issue: "npm not found"
- Node.js not installed
- Download from https://nodejs.org/
- Restart terminal after install

### Issue: "Cannot login - wrong credentials"
- Email: `admin@crm.local` (lowercase)
- Password: `admin123`
- Check browser console for errors (F12 → Console tab)

### Issue: "Blank white page in browser"
```bash
# Check browser console for errors
# Press: F12 (or Cmd+Option+I on Mac)
# Click "Console" tab
# Look for red error messages

# Backend not responding?
# Check backend is running: npm run dev in backend terminal

# Check API is reachable
curl http://localhost:5000/api/health
```

### Issue: "Deals don't show on board"
```bash
# Check if seed data exists
docker exec -it crm_postgres psql -U postgres -d crm_db -c \
  "SELECT COUNT(*) FROM deals;"

# If returns 0, seed didn't run
# Run migration and seed manually
cd ~/learn/backend
npm run migrate
npm run seed
```

### Issue: "Drag & drop not working"
- Try refresh page (Cmd+R or Ctrl+R)
- Check browser console for JavaScript errors (F12)
- Clear browser cache and reload

---

## ✅ Success Indicators

Your CRM is **WORKING PERFECTLY** if:

✅ **Database**
- PostgreSQL container running
- Can execute SQL queries

✅ **Backend**
- Server running on :5000
- API responds to health check
- Login endpoint returns JWT token

✅ **Frontend**
- React running on :5173
- Can login to dashboard
- Kanban board visible with deal cards

✅ **Features**
- Can view all deals
- Can create new deal
- Can drag deals between stages
- Can filter by country/product

---

## 📞 Getting Help

1. **Check the output in terminal** - Error messages are very helpful!
2. **Read error messages carefully** - They usually tell you exactly what's wrong
3. **Try the troubleshooting section above** - Most issues covered
4. **Check other docs:**
   - `START_HERE.md` - Quick start guide
   - `LOCAL_RUN.md` - Detailed local setup
   - `SETUP.md` - Configuration details

---

## 🎯 You're Good If...

After going through this checklist, you should be able to:

1. ✅ Run `docker-compose up -d` to start database
2. ✅ Run `npm run dev` in backend folder to start server
3. ✅ Run `npm run dev` in frontend folder to start React
4. ✅ Open http://localhost:5173 in browser
5. ✅ Login with admin@crm.local / admin123
6. ✅ See Kanban board with deal cards
7. ✅ Drag & drop deals between stages
8. ✅ Create new deals

**If all 8 items work, your CRM is fully functional! 🎉**

---

**You've got this! Your CRM is running perfectly.** 🚀
