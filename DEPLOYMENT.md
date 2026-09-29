# Deployment Guide - Quantic Marketing Funnel CRM

Complete guide to deploy the application to production.

## Table of Contents
1. [Local Development](#local-development)
2. [Vercel Deployment](#vercel-deployment)
3. [Heroku Deployment](#heroku-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Post-Deployment](#post-deployment)

---

## Local Development

### Prerequisites
- Node.js v18+
- PostgreSQL 15+
- npm or yarn

### Setup

```bash
# Clone/Setup Backend
cd ~/learn/backend
npm install
npm run migrate
npm run seed
npm run dev  # Runs on http://localhost:5000

# Setup Frontend (in new terminal)
cd ~/learn/frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

### Testing
- Open http://localhost:5173
- Login: joe / password123
- Test all features: Create deal, move deal, filter, admin panel

---

## Vercel Deployment

### Option 1: Separate Deployments (Recommended)

#### Backend Deployment

```bash
# 1. Push backend to GitHub
cd ~/learn/backend
git add .
git commit -m "Backend ready for deployment"
git push

# 2. Go to https://vercel.com
# 3. Import project → Select /backend folder
# 4. Add environment variables:
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_secure_secret_key

# 5. Deploy
```

**Backend URL:** `https://your-project-api.vercel.app`

#### Frontend Deployment

```bash
# 1. Update .env with backend URL
cd ~/learn/frontend
echo "VITE_API_URL=https://your-project-api.vercel.app/api" > .env.production

# 2. Push frontend to GitHub
git add .
git commit -m "Frontend ready for deployment"
git push

# 3. Go to https://vercel.com
# 4. Import project → Select /frontend folder
# 5. Add environment variables:
VITE_API_URL=https://your-project-api.vercel.app/api

# 6. Deploy
```

**Frontend URL:** `https://your-project.vercel.app`

---

## Heroku Deployment

### Backend on Heroku

```bash
# 1. Install Heroku CLI
brew tap heroku/brew && brew install heroku

# 2. Login
heroku login

# 3. Create app
heroku create your-crm-api

# 4. Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev --app your-crm-api

# 5. Set environment variables
heroku config:set JWT_SECRET=your_secret --app your-crm-api

# 6. Deploy
cd backend
git push heroku main

# 7. Run migrations
heroku run "npm run migrate" --app your-crm-api
heroku run "npm run seed" --app your-crm-api
```

**Backend URL:** `https://your-crm-api.herokuapp.com`

### Frontend on Netlify

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Go to https://netlify.com
# 3. Drag and drop /dist folder
# 4. Set environment variables in settings:
VITE_API_URL=https://your-crm-api.herokuapp.com/api

# 5. Deploy
```

---

## Environment Variables

### Backend (.env or Vercel/Heroku)

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database_name
JWT_SECRET=your_very_secure_secret_key_min_32_chars
```

### Frontend (.env or Vercel/Netlify)

```env
VITE_API_URL=https://your-backend-url/api
```

---

## Database Setup

### Option 1: Vercel PostgreSQL

```bash
# No longer available - use external providers
```

### Option 2: Heroku PostgreSQL

```bash
heroku addons:create heroku-postgresql:hobby-dev
heroku pg:info
```

### Option 3: AWS RDS

1. Create RDS PostgreSQL instance
2. Get connection string
3. Set `DATABASE_URL` in environment variables

### Option 4: Railway.app (Easiest)

```bash
# 1. Go to railway.app
# 2. Create new project
# 3. Add PostgreSQL service
# 4. Get CONNECTION_STRING
# 5. Set as DATABASE_URL
```

### Running Migrations on Production

```bash
# Vercel
vercel env pull
npm run migrate

# Heroku
heroku run "npm run migrate" --app your-app-name

# Manually via psql
psql postgresql://user:pass@host:5432/db -f src/db/migrations/001_create_tables.sql
```

---

## Post-Deployment

### Verification

```bash
# Test backend
curl https://your-backend-url/health

# Expected response:
# {"status":"Server is running"}

# Test API
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"joe","password":"password123"}'
```

### Security Checklist

- [ ] Change all demo user passwords
- [ ] Rotate JWT_SECRET
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up CORS properly for production domain
- [ ] Enable database backups
- [ ] Set up monitoring/logging
- [ ] Add rate limiting to API
- [ ] Review security headers

### Monitoring

```bash
# Vercel logs
vercel logs your-project

# Heroku logs
heroku logs --tail --app your-app-name

# Setup alerts for errors
```

### Scaling

- **Database:** Upgrade from hobby tier to standard
- **Backend:** Increase dyno type (Heroku) or Pro plan (Vercel)
- **Frontend:** Enable CDN caching
- **Add:** Redis for sessions if needed

---

## Troubleshooting

### Frontend doesn't connect to backend
1. Check `VITE_API_URL` is correct
2. Verify CORS is enabled in backend
3. Check network tab in browser DevTools

### Database connection fails
1. Verify `DATABASE_URL` is set
2. Check IP whitelist if using cloud DB
3. Ensure network allows outbound connections

### Migrations fail
1. SSH into server and check database
2. Manually verify table existence
3. Check logs for SQL errors

### CORS errors
Update backend CORS:
```javascript
app.use(cors({
  origin: 'https://your-frontend-url',
  credentials: true
}));
```

---

## Production Checklist

Before going live:

- [ ] Test login with all 3 demo users
- [ ] Create, edit, delete deals
- [ ] Test all filters
- [ ] Test admin panel
- [ ] Verify email notifications (if added)
- [ ] Check responsive design on mobile
- [ ] Test in Chrome, Firefox, Safari
- [ ] Verify all API endpoints
- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics (Mixpanel)
- [ ] Create admin documentation
- [ ] Train users

---

## Rollback

### Vercel
```bash
# Go to Deployments tab → Select previous version → Redeploy
```

### Heroku
```bash
heroku releases
heroku releases:rollback v12
```

---

## Support

For deployment issues:
- Check logs first
- Verify environment variables
- Test with curl/Postman
- Review error messages carefully

---

**Version:** 1.0.0  
**Last Updated:** 2026-09-29
