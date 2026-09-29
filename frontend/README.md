# CRM Platform Frontend

React-based frontend for Quantic Marketing Funnel CRM Platform.

## Setup

### Prerequisites
- Node.js (v18+)
- Backend API running on `http://localhost:5000`

### Installation

```bash
cd frontend
npm install
```

### Environment Configuration

Create `.env` file (or copy from `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

## Development

### Start Development Server

```bash
npm run dev
```

Server runs on: `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/           # Page components (Login, Dashboard, AdminPanel)
│   ├── components/      # Reusable components (Pipeline, Cards, Modal, etc.)
│   ├── context/         # React context (Auth)
│   ├── hooks/           # Custom hooks (useAuth, usePrivateRoute)
│   ├── services/        # API service (axios client)
│   ├── styles/          # CSS modules and global styles
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app with routing
│   └── main.jsx         # Entry point
├── .env                 # Environment variables
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## Features (Phases)

### ✅ Phase 3: Frontend Setup
- [x] React project with Vite
- [x] Routing with React Router
- [x] Authentication context
- [x] API client with axios
- [x] Login page
- [x] Private route protection

### 🚧 Phase 4: Pipeline Board
- [ ] Kanban board layout
- [ ] Deal cards
- [ ] Drag-and-drop functionality
- [ ] Filters (by country, product, process type)
- [ ] Process type tabs
- [ ] Backend integration

### 🚧 Phase 5: Deal Management
- [ ] Deal detail modal
- [ ] Deal form (create/edit)
- [ ] Team member selection
- [ ] Form validation
- [ ] CRUD operations

### 🚧 Phase 6: Admin Panel
- [ ] User management
- [ ] Process type management
- [ ] Settings page

## Authentication

Login flow:
1. User enters credentials on login page
2. API authenticates and returns JWT token
3. Token stored in localStorage
4. Token added to all API requests via axios interceptor
5. On 401 response, user redirected to login
6. Private routes protected via PrivateRoute component

Sample Users:
- **joe** / password123
- **senthil** / password123
- **cto_viewer** / password123

## API Integration

All API calls made via `/src/services/api.js`:

```javascript
import { dealAPI, userAPI, processTypeAPI } from '../services/api';

// Get all deals
const deals = await dealAPI.getAll({ stage: 'interested' });

// Create deal
await dealAPI.create({ company_name: '...', ... });

// Update deal stage
await dealAPI.updateStage(dealId, 'proposal_sent');
```

Axios automatically:
- Adds Authorization header with token
- Redirects to login on 401 error
- Handles request/response errors

## Styling

Global styles in `/src/styles/index.css`
Component styles use CSS modules (e.g., `Login.module.css`)

Utility classes available:
- `.flex`, `.flex-center`
- `.gap-1`, `.gap-2`, `.gap-3`
- `.p-1`, `.p-2`, `.p-3`
- `.mb-1`, `.mb-2`, `.mb-3`
- `.mt-1`, `.mt-2`, `.mt-3`

## Deployment

Build and deploy to Vercel, Netlify, or any static hosting:

```bash
npm run build
# Deploy dist/ folder
```

Environment variables needed:
- `VITE_API_URL` - Backend API URL

---

**Next Phase:** Frontend components for Pipeline Board (Phase 4)
