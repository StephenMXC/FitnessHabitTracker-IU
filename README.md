# Fitness Tracker Web Application

## Overview

This is a full-stack web application for tracking habits and fitness progress.

* **Frontend:** React (Vite)
* **Backend:** Node.js with Express
* **Database:** SQLite (file-based)

---
-------------------------------------------------------------------------
## How to set up

Make sure the following are installed:

* Node.js (v16 or higher)
* npm (comes with Node.js)
To check, open terminal and run:
```
node -v
```
then,
```
npm -v
```
You should see a version number printed after each of these commands. If not, install online.

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

Open a terminal, run in order:

(Before running, make sure you are in "Umer-Yousuf_9216421_DLBCSPJWD01_PJWD\FitnessHabitTracker-IU-main\". 
If not, run ```cd Umer-Yousuf_9216421_DLBCSPJWD01_PJWD\FitnessHabitTracker-IU-main\``` from the place where the extracted file appears after unzipping. Then run the following.)
```
  cd backend
```
```
  npm install
```
```
  npm start
```

* Backend will run on:
  `http://localhost:5000`

---

### 3. **Configure environment variables:**
Open another terminal, leaving the first one on, and do the following:

   - Copy `.env.example` in /backend/ to `.env`.
    Preferably, in a new terminal in /backend, run:
   - 
   ```  
     cp .env.example .env
```

### 4. Start Frontend

Open yet another new terminal in Umer-Yousuf_9216421_DLBCSPJWD01_PJWD\FitnessHabitTracker-IU-main\:

```
  cd frontend
```
```
  npm install
```
```
  npm run dev
```

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
Now, testing/using can be done.
-------------------------------------------------------------------------
Extra notes:

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
