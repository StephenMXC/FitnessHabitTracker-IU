# Frontend-Backend Integration Setup Guide

## What Was Implemented

### 1. **API Service** (`src/services/api.js`)
- Centralized backend communication layer
- Handles all HTTP requests (auth, habits, dashboard)
- Automatic token management (stores JWT in localStorage)
- Auto error handling and 401 response

### 2. **Auth Context** (`src/contexts/AuthContext.jsx`)
- Global authentication state management
- Functions: `login()`, `signup()`, `logout()`
- Persists user session on page reload
- Provides `useAuth()` hook for components

### 3. **Auth Pages**
- **Login** (`src/pages/Auth/Login.jsx`) - Username/password login
- **Signup** (`src/pages/Auth/Signup.jsx`) - Create new account with email validation

### 4. **Protected Routes** (`src/components/ProtectedRoute.jsx`)
- Guards Dashboard & Habits pages (redirects to login if not authenticated)
- Shows loading state while checking auth

### 5. **Integration Updates**
- **App.jsx** - Updated routing with auth flow
- **Dashboard.jsx** - Displays total habits & completed today from backend
- **Habits.jsx** - Full CRUD operations (Create, Read, Update, Delete)
- **Sidebar.jsx** - Added logout button, removed Fitness page

---

## How to Test

### Step 1: Start Backend
```bash
cd backend
npm start
```
You should see:
```
Connected to SQLite database
Users table ready
Habits table ready
HabitRecords table ready
Server running on http://localhost:5000
```

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```
You should see:
```
Local:   http://localhost:5173/
```

### Step 3: Full User Flow

1. **Sign Up** (http://localhost:5173/signup)
   - Create account with username, email, password
   - Automatically logs in and redirects to dashboard

2. **Dashboard** (http://localhost:5173/)
   - Shows total habits & completed today
   - Fetches real data from backend

3. **Create Habit** (http://localhost:5173/habits)
   - Click "Create Habit" button
   - Fill in name, category, description
   - New habit appears in list

4. **Manage Habits**
   - Edit: Click Edit button, change name
   - Delete: Click Delete button, confirm removal

5. **Logout**
   - Click logout button in sidebar
   - Redirected to login page
   - Token removed from localStorage

### Step 4: Additional Testing

**Test Unauthenticated Access:**
- Open http://localhost:5173/habits without logging in
- Should redirect to login page

**Test Token Persistence:**
- Sign in
- Refresh page
- Should stay logged in

**Test Invalid Token:**
- Clear localStorage (DevTools → Application → Local Storage)
- Refresh page
- Should redirect to login

---

## API Endpoints Used

| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/habits` | Yes | Get user's habits |
| POST | `/api/habits` | Yes | Create habit |
| PUT | `/api/habits/:id` | Yes | Update habit |
| DELETE | `/api/habits/:id` | Yes | Delete habit |
| GET | `/api/dashboard/stats` | Yes | Get dashboard stats |

---

## Token Storage

Tokens are stored in `localStorage`:
- **Key:** `authToken` - JWT token for API requests
- **Key:** `userId` - User ID for reference

Each API request automatically includes the token in the Authorization header:
```
Authorization: Bearer eyJhbGc...
```

---

## File Structure

```
frontend/
├── services/
│   └── api.js                 # Backend API calls
├── contexts/
│   └── AuthContext.jsx        # Global auth state
├── components/
│   ├── ProtectedRoute.jsx     # Route guard
│   └── Sidebar/
│       └── Sidebar.jsx        # Updated with logout
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── Dashboard/
│   │   └── Dashboard.jsx      # Connected to backend
│   └── Habits/
│       └── Habits.jsx         # Full CRUD integration
└── App.jsx                    # Updated routing
```

---

## Troubleshooting

**"Cannot find module" error:**
- Make sure you ran `npm install` in frontend folder
- All dependencies are already in package.json

**Backend connection error:**
- Check backend is running on http://localhost:5000
- Check CORS is enabled (it is in server.js)
- Check API_BASE_URL in `src/services/api.js` is correct

**Login fails:**
- Check credentials match what you signed up with
- Check backend database has user (should be in `fitness_tracker.db`)

**Components not updating:**
- Open DevTools → Network tab
- Check if API calls are successful (200 status)
- Check if response data looks correct

