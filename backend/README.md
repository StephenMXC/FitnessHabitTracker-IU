# Fitness Tracker Backend

A Node.js/Express backend with SQLite3 for tracking user habits and fitness goals.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the server:**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:5000`

3. **Database:**
   - SQLite database file will be created automatically as `fitness_tracker.db`
   - All tables are initialized on first run

## API Endpoints

### Authentication
- **POST** `/api/auth/signup` - Create new user
  ```json
  { "username": "john", "email": "john@example.com", "password": "password123" }
  ```
  Returns: `{ "token": "JWT_TOKEN", "userId": 1 }`

- **POST** `/api/auth/login` - Login user
  ```json
  { "username": "john", "password": "password123" }
  ```
  Returns: `{ "token": "JWT_TOKEN", "userId": 1 }`

### Habits (All require Authorization header: `Bearer TOKEN`)
- **GET** `/api/habits` - Get all user's habits
  
- **POST** `/api/habits` - Create new habit
  ```json
  { "name": "Morning Run", "category": "exercise", "description": "30 min run" }
  ```
  
- **PUT** `/api/habits/:id` - Update habit
  ```json
  { "name": "Evening Run", "category": "exercise", "description": "30 min run" }
  ```
  
- **DELETE** `/api/habits/:id` - Delete habit

### Dashboard
- **GET** `/api/dashboard/stats` - Get dashboard statistics (requires authorization)
  Returns: `{ "totalHabits": 5, "completedToday": 2 }`

## Database Schema

### users
- `id` (INTEGER PRIMARY KEY)
- `username` (TEXT UNIQUE)
- `email` (TEXT UNIQUE)
- `password` (TEXT - hashed)
- `createdAt` (DATETIME)

### habits
- `id` (INTEGER PRIMARY KEY)
- `userId` (INTEGER FOREIGN KEY)
- `name` (TEXT)
- `category` (TEXT)
- `description` (TEXT)
- `createdAt` (DATETIME)

### habitRecords
- `id` (INTEGER PRIMARY KEY)
- `habitId` (INTEGER FOREIGN KEY)
- `date` (DATE)
- `completed` (INTEGER - 0 or 1)
- `notes` (TEXT)

## Important Notes

- All passwords are hashed using bcryptjs before storing
- JWT tokens expire in 30 days
- All authenticated endpoints require the token in the `Authorization` header as `Bearer TOKEN`
- User data is isolated - each user only sees their own habits
- Delete operations cascade (deleting a habit also deletes its records)
