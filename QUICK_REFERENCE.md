# ⚡ QUICK REFERENCE CARD

**Keep this handy. Print it out!**

---

## 🚀 START EVERYTHING (One Command)

```bash
bash ~/learn/start.sh
```

This opens 2 terminals and starts everything automatically.

---

## 🔥 MANUAL START (Step by Step)

### Terminal 1: Database
```bash
cd ~/learn/backend
docker-compose up -d
```

### Terminal 2: Backend  
```bash
cd ~/learn/backend
npm run dev
```

### Terminal 3: Frontend
```bash
cd ~/learn/frontend
npm run dev
```

### Browser
Open: **http://localhost:5173**

---

## 🔐 Default Credentials

| Field | Value |
|-------|-------|
| Email | admin@crm.local |
| Password | admin123 |

---

## 📝 Essential Commands

### npm
```bash
npm install          # Install dependencies (once)
npm run dev          # Start dev server
npm run build        # Production build
Ctrl+C               # Stop server
```

### Docker
```bash
docker-compose up -d     # Start database
docker-compose down      # Stop database  
docker ps                # List containers
docker logs crm_postgres # See logs
```

### Database
```bash
# Check if running
docker ps

# Run SQL query
docker exec -it crm_postgres psql -U postgres -d crm_db -c "SELECT 1;"

# List all deals
docker exec -it crm_postgres psql -U postgres -d crm_db -c \
  "SELECT company_name, deal_value, stage FROM deals LIMIT 5;"
```

### Port Checking
```bash
# See what's using port 5000
lsof -i :5000

# Kill process (replace PID with number)
kill -9 <PID>
```

---

## 🔗 Local URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| API | http://localhost:5000/api |
| Database | localhost:5432 |

---

## 📁 Project Structure

```
~/learn/
├── backend/               # Express.js API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── db/           # Database
│   │   └── config/       # Configuration
│   ├── package.json
│   └── docker-compose.yml
├── frontend/              # React UI
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Pages
│   │   └── services/     # API client
│   └── package.json
├── START_HERE.md         # ← START HERE
├── VERIFY.md             # Verification checklist
├── LOCAL_RUN.md          # Detailed guide
└── API_DOCUMENTATION.md  # API reference
```

---

## 🛠️ Troubleshooting One-Liners

| Problem | Solution |
|---------|----------|
| `npm: not found` | Install Node.js from https://nodejs.org |
| Port 5000 in use | `kill -9 $(lsof -t -i :5000)` |
| Port 5173 in use | `kill -9 $(lsof -t -i :5173)` |
| Docker not running | Open Docker Desktop app |
| Can't connect to DB | Wait 10 seconds, Docker needs time |
| Blank page in browser | Press F12, check console for errors |
| Can't login | Check email is `admin@crm.local` (lowercase) |
| Deals not showing | Run: `npm run seed` in backend folder |

---

## 🧪 Test Commands

```bash
# Test backend is running
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.local","password":"admin123"}'

# Get all deals
curl http://localhost:5000/api/deals \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎨 File Locations for Editing

| What | Where |
|------|-------|
| React components | `frontend/src/components/` |
| API routes | `backend/src/routes/` |
| Database migrations | `backend/src/db/migrations/` |
| Styles | `frontend/src/styles/` |
| API logic | `backend/src/controllers/` |
| Environment variables | `backend/.env` |

---

## 📱 Development Tools

### Browser (Built-in)
```
Chrome/Safari: Press F12 or Cmd+Option+I
- Console: See errors
- Network: See API calls
- Elements: See HTML structure
```

### Optional Browser Extensions
- React Developer Tools (for debugging React)
- Postman (for API testing)

### Command Line
```bash
curl          # Test APIs
docker        # Manage containers
psql          # Query database directly
npm           # Manage packages
```

---

## 🚫 Common Mistakes

❌ **Wrong:** `npm install` in wrong folder
✅ **Right:** Run it in backend AND frontend separately

❌ **Wrong:** Closing terminal stops server permanently  
✅ **Right:** Server keeps running in that terminal

❌ **Wrong:** Editing code without restarting dev server
✅ **Right:** Dev server auto-reloads on save (usually)

❌ **Wrong:** Using wrong email (capital letters)
✅ **Right:** `admin@crm.local` (lowercase only)

❌ **Wrong:** Clicking "New Deal" without backend running
✅ **Right:** Make sure backend terminal shows "Server running"

---

## ✅ Health Check Checklist

Run this daily:

```bash
# 1. Database
docker ps | grep crm_postgres
# Should show: crm_postgres ... Up

# 2. Backend running?
curl http://localhost:5000/api/health
# Should return: {"status":"ok"}

# 3. Frontend accessible?
curl http://localhost:5173
# Should return HTML (no error)

# 4. Can login?
# Open http://localhost:5173
# Try login with admin@crm.local / admin123
```

---

## 💡 Pro Tips

💡 **Tip 1:** Keep 3 terminals open (DB, Backend, Frontend)
- Easier to see all errors at once

💡 **Tip 2:** Use `npm run dev` instead of `npm start`
- Gives you better error messages

💡 **Tip 3:** Always check browser DevTools (F12)
- 90% of problems are visible in console

💡 **Tip 4:** Restart backend if frontend changes break
- Sometimes React doesn't auto-reload properly

💡 **Tip 5:** Database stays running even if you close terminal
- No need to restart Docker each time

---

## 📞 Quick Help

**What file do I edit?**
- Frontend visual stuff → `frontend/src/components/`
- Backend logic → `backend/src/controllers/`
- Styling → `frontend/src/styles/` or `backend/src/styles/`

**Nothing shows up?**
1. Check browser console (F12)
2. Check terminal for errors
3. Restart dev servers (Ctrl+C, then npm run dev)

**API not responding?**
1. Check backend terminal (should say "Server running")
2. Check database is running (docker ps)
3. Restart backend: Ctrl+C → npm run dev

**Page looks broken?**
1. Hard refresh: Cmd+Shift+R (or Ctrl+Shift+R)
2. Clear browser cache
3. Restart frontend dev server

---

## 🎯 Next Steps

After everything is running:

1. ✅ View dashboard
2. ✅ Try creating a deal
3. ✅ Drag deal between stages
4. ✅ Edit deal details
5. ✅ Use filters
6. ✅ Explore admin panel

---

## 📚 Need More Help?

| Need | Read |
|------|------|
| Can't start? | `START_HERE.md` |
| Something broken? | `VERIFY.md` |
| Detailed setup? | `SETUP.md` |
| API details? | `API_DOCUMENTATION.md` |
| Local dev guide? | `LOCAL_RUN.md` |
| Test via curl? | `TEST_API.md` |

---

**Print this page. Keep it near your computer. You got this! 🚀**
