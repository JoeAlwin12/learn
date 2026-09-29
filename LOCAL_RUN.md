# 🚀 Run Quantic CRM Locally on macOS

**Complete step-by-step guide to get the CRM running on your desktop in 10 minutes.**

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Start PostgreSQL

Choose ONE option:

#### Option A: Docker (Easiest - No Installation)
```bash
cd ~/learn/backend
docker-compose up -d
```

That's it! PostgreSQL is running in background.

#### Option B: Homebrew (Local Installation)
```bash
# Install PostgreSQL (one-time)
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify it's running
psql postgres
# Type: \q to exit
```

---

### Step 2: Setup Backend

**Open Terminal 1:**

```bash
cd ~/learn/backend

# Install dependencies
npm install

# Create database tables
npm run migrate

# Load sample data
npm run seed

# Start backend server
npm run dev
```

**Expected output:**
```
✓ Server running on http://localhost:5000
✓ API documentation:
  - Authentication: POST /api/auth/login
  - Users: GET/POST /api/users
  - Deals: GET/POST /api/deals
```

✅ **Backend is running on port 5000**

---

### Step 3: Setup Frontend

**Open Terminal 2 (new terminal window):**

```bash
cd ~/learn/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
VITE v8.3.0  ready in 234 ms

➜  Local:   http://localhost:5173/
```

✅ **Frontend is running on port 5173**

---

### Step 4: Open in Browser

**Click or open:** http://localhost:5173

You should see the **Quantic Marketing Funnel** login page.

---

## 🔓 Login

**Use any of these demo accounts:**

| Username | Password |
|----------|----------|
| joe | password123 |
| senthil | password123 |
| cto_viewer | password123 |

**Login with:** `joe` / `password123`

---

## ✅ Verify Everything Works

After login, you should see:

1. **Pipeline Board** with 6 columns (Interested → Closed Lost)
2. **Deal cards** with company names and values
3. **Filter dropdowns** at the top
4. **Process type tabs** (Private, PSU-Relationship, PSU-Tender)
5. **New Deal button** in top-right

**Test features:**
- Click a deal card → View deal details
- Click "New Deal" → Create a deal
- Click menu (⋮) on a card → Options
- Use filters → Select country/product
- Click process type tabs → Switch processes

---

## 🎯 Full Testing Checklist

```bash
✅ Login
✅ View Pipeline Board
✅ See 9 sample deals
✅ Click deal to view details
✅ Create new deal
✅ Edit deal
✅ Delete deal
✅ Move deal between stages
✅ Use country filter
✅ Use product filter
✅ Switch process types
✅ Click Admin button
✅ Manage users
✅ Manage process types
✅ Logout
```

---

## 📱 Test Different Devices

### Desktop
```
http://localhost:5173
```
**Full width Pipeline Board**

### Mobile (Chrome DevTools)
1. Press F12 or Cmd+Option+I
2. Click phone icon
3. Choose iPhone or Android
4. Verify layout is responsive

---

## 🛑 Stop the Application

### Stop Frontend
- Press `Ctrl+C` in Terminal 2

### Stop Backend
- Press `Ctrl+C` in Terminal 1

### Stop PostgreSQL

**Docker:**
```bash
cd ~/learn/backend
docker-compose down
```

**Homebrew:**
```bash
brew services stop postgresql@15
```

---

## 🔧 Troubleshooting

### Issue: "Port 5000 already in use"
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

### Issue: "Port 5173 already in use"
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Issue: "Cannot connect to database"
```bash
# Check if PostgreSQL is running
# Docker:
docker ps

# Homebrew:
brew services list
```

### Issue: "npm install fails"
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Module not found errors"
```bash
# Reinstall dependencies
cd backend
npm install

cd ../frontend
npm install
```

### Issue: Login fails
```bash
# Reset sample data
cd backend
npm run seed

# Restart backend
npm run dev
```

---

## 📊 Check What's Running

```bash
# Check backend
curl http://localhost:5000/health
# Should return: {"status":"Server is running"}

# Check frontend
# Should load at http://localhost:5173

# Check PostgreSQL (Docker)
docker ps

# Check PostgreSQL (Homebrew)
brew services list | grep postgresql
```

---

## 🗂️ File Locations

```
~/learn/
├── backend/           → Backend code
│   ├── src/server.js  → Main file
│   ├── .env           → Config
│   └── package.json   → Dependencies
│
├── frontend/          → Frontend code
│   ├── src/App.jsx    → Main file
│   ├── .env           → Config
│   └── package.json   → Dependencies
```

---

## 📝 Important Files

| File | Purpose |
|------|---------|
| `backend/.env` | Database & JWT config |
| `frontend/.env` | API URL config |
| `backend/src/server.js` | Express server |
| `frontend/src/App.jsx` | React main app |

---

## 🔍 Logs

### Backend Logs
```
Check Terminal 1 where backend is running
Look for errors or API requests
```

### Frontend Logs
```
Check Terminal 2 where frontend is running
Check browser console (F12) for errors
```

### Database Logs
```bash
# Docker
docker logs crm_postgres

# Homebrew
# Check system logs
```

---

## 💾 Database

### View Data
```bash
# Connect to database
psql postgresql://postgres:postgres@localhost:5432/crm_db

# List tables
\dt

# View deals
SELECT * FROM deals;

# Exit
\q
```

### Reset Database
```bash
cd ~/learn/backend
npm run seed
```

---

## 🚀 Next Steps

1. **Explore** the UI - Click around, test features
2. **Create** a deal - Try the modal form
3. **Manage** - Go to Admin panel
4. **Study** the code - Read backend/frontend structure
5. **Deploy** - Follow DEPLOYMENT.md when ready

---

## 💡 Tips

- **Both terminals open at once** - Keep backend & frontend running together
- **Auto-reload** - Both dev servers auto-reload on code changes
- **API Testing** - Use Postman collection: `backend/CRM_API.postman_collection.json`
- **Logs** - Check terminal output for errors/info
- **DevTools** - Use F12 in browser for frontend debugging

---

## 🎉 Success!

You're now running a **full-stack CRM application** locally! 🚀

### What You Have Running:
- ✅ Backend API (http://localhost:5000)
- ✅ Frontend (http://localhost:5173)
- ✅ PostgreSQL Database (port 5432)
- ✅ 3 Demo Users
- ✅ 9 Sample Deals

### What You Can Do:
- Create/edit/delete deals
- Move deals between stages
- Filter by country/product
- Manage users (admin)
- Manage process types (admin)
- Test all features

---

## 📞 Quick Help

| Problem | Solution |
|---------|----------|
| Nothing loads | Check both terminals are running |
| Login fails | Run `npm run seed` in backend |
| Can't create deal | Try refreshing browser (F5) |
| Slow performance | Check Docker resources allocated |
| Database error | Run `npm run migrate && npm run seed` |

---

## 🎓 What to Explore

1. **Frontend Components** - `frontend/src/components/`
2. **Backend APIs** - `backend/src/routes/`
3. **Database** - `backend/src/db/migrations/`
4. **Styling** - `frontend/src/styles/`
5. **Authentication** - `frontend/src/context/AuthContext.jsx`

---

**Enjoy your CRM! Happy exploring! 🎉**

For questions, check the main README.md or DEPLOYMENT.md
