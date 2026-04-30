# Fitness Tracker Web Application

## Overview

This is a full-stack web application for tracking habits and fitness progress.

* **Frontend:** React (Vite)
* **Backend:** Node.js with Express
* **Database:** SQLite (file-based)

---

## Requirements

Make sure the following are installed:

* Node.js (v16 or higher)
* npm (comes with Node.js)

---

## Project Structure

```
root/
├── backend/    # Server, API, database
├── frontend/   # React user interface
```

---

## Installation & Setup

### 1. Extract the Project

Unzip the submitted folder.

---

### 2. Start Backend

Open a terminal:


cd backend
npm install
npm start


* Backend will run on:
  `http://localhost:5000`

---

### 3. **Configure environment variables:**
   - Copy `.env.example` in /backend/ to `.env`:
   - 
     ```bash
     cp .env.example .env
     ```


### 4. Start Frontend

Open a new terminal:


cd frontend
npm install
npm run dev


* Frontend will run on:
  `http://localhost:5173`

---

## Running the Application

1. Start the backend first
2. Then start the frontend
3. Open your browser and go to:

```
http://localhost:5173
```

---

## Database (SQLite)

* The project uses SQLite, which requires no installation.
* The database file is automatically created at:

```
backend/fitness_tracker.db
```

### Important:

* Each time the backend starts:

  * All tables are deleted
  * New tables are created
* This means the database resets every time the server runs.

---

## Notes

* `node_modules` folders can be recreated using `npm install`
* Make sure ports 5000 and 5173 are not already in use
* Backend must be running before frontend

---

## Troubleshooting

* If errors occur:

  * Delete `node_modules` and run `npm install` again
* If the app does not load:

  * Check both servers are running
* If port is busy:

  * Change the port in backend configuration

---

## Author

Yousuf Umer
