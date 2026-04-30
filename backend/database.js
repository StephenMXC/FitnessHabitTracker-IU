// ============================================
// DATABASE SETUP & INITIALIZATION
// ============================================
// PURPOSE: Connect to SQLite database and create schema tables on startup.
// TABLES: users, habits, dailyCompletion, habitRecords
// ============================================

const sqlite3 = require('sqlite3').verbose();
//                                               The require function is how we include external modules in Node.js. 
//                                               It's like "import" in other languages.  
//                                               The .verbose() part is just for better error messages. Without it, you might get less helpful error logs.

const path = require('path'); //  A built-in Node.js module for working with file paths.
//                                We'll use it to create a path to our database file that works on any OS.

// This bit creates a path to the database file. It will be in the same directory as this database.js file and will be called fitness_tracker.db.
const dbPath = path.join(__dirname, 'fitness_tracker.db');

// Now this creates a new SQLite database connection. 
// If the file doesn't exist, it will be created. 
// The callback checks for errors and logs whether the connection was successful.
// If there’s an error opening the database, it will log that error. Otherwise, it will log that we’re connected and then call the function to initialize the database tables.
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema - creates all necessary tables
// Tables are dropped and recreated on each app startup to ensure fresh state
// ORDER MATTERS: Must drop in reverse dependency order due to foreign key constraints
//   1. habitRecords (depends on habits)
//   2. dailyCompletion (depends on users)
//   3. habits (depends on users)
//   4. users (no dependencies)
function initializeDatabase() {
  // Drop habitRecords first (depends on habits table)
  db.run('DROP TABLE IF EXISTS habitRecords', (err) => {
    if (err) console.error('Error dropping habitRecords table:', err);
    db.run('DROP TABLE IF EXISTS dailyCompletion', (err) => {
      if (err) console.error('Error dropping dailyCompletion table:', err);
      db.run('DROP TABLE IF EXISTS habits', (err) => {
        if (err) console.error('Error dropping habits table:', err);
        db.run('DROP TABLE IF EXISTS users', (err) => {
          if (err) console.error('Error dropping users table:', err);
          // Create users table - stores user account information
          // AUTOINCREMENT id ensures each user gets unique ID
          // UNIQUE constraints prevent duplicate usernames/emails
          db.run(`
            CREATE TABLE users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique identifier for each user
              username TEXT UNIQUE NOT NULL,           -- Login username, must be unique
              email TEXT UNIQUE NOT NULL,              -- User email, must be unique
              password TEXT NOT NULL,                  -- Hashed password (never plain text)
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP  -- Auto-set to account creation time
            )
          `, (err) => {
            if (err) console.error('Error creating users table:', err);
            else console.log('Users table ready');
            
            // Create habits table - stores all habits created by users
            db.run(`
              CREATE TABLE habits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,      -- Unique habit identifier
                userId INTEGER NOT NULL,                     -- Links to user who created habit
                name TEXT NOT NULL,                          -- Habit name/title
                category TEXT DEFAULT 'general',             -- Category (general, fitness, etc.)
                description TEXT,                            -- Optional habit description
                image LONGTEXT,                              -- Base64 encoded image (can be large)
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, -- When habit was created
                -- Foreign key: if user is deleted, all their habits are deleted too
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
              )
            `, (err) => {
              if (err) console.error('Error creating habits table:', err);
              else console.log('Habits table ready');
              
              // Create dailyCompletion table - tracks 100% completion days
              // Records when user completes ALL their habits in a single day
              db.run(`
                CREATE TABLE dailyCompletion (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,      -- Unique record identifier
                  userId INTEGER NOT NULL,                    -- Links to user
                  date DATE NOT NULL,                         -- Date in YYYY-MM-DD format
                  isFullyCompleted INTEGER DEFAULT 0,         -- 1 = all habits done, 0 = not all done
                  -- Foreign key: if user deleted, their daily completion records deleted
                  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                  -- UNIQUE constraint: one record per user per day
                  UNIQUE(userId, date)
                )
              `, (err) => {
                if (err) console.error('Error creating dailyCompletion table:', err);
                else console.log('DailyCompletion table ready');
                
                // Create habitRecords table - tracks daily completion status of individual habits
                // Each row = one habit on one date
                db.run(`
                  CREATE TABLE habitRecords (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,     -- Unique record identifier
                    habitId INTEGER NOT NULL,                  -- Links to specific habit
                    date DATE NOT NULL,                        -- Date in YYYY-MM-DD format
                    completed INTEGER DEFAULT 0,               -- 1 = completed, 0 = not completed
                    notes TEXT,                                -- Optional notes about completion
                    -- Foreign key: if habit deleted, all its records deleted
                    FOREIGN KEY (habitId) REFERENCES habits(id) ON DELETE CASCADE,
                    -- UNIQUE constraint: one record per habit per day (can't mark same habit twice on same day)
                    UNIQUE(habitId, date)
                  )
                `, (err) => {
                  if (err) console.error('Error creating habitRecords table:', err);
                  else console.log('HabitRecords table ready');
                });
              });
            });
          });
        });
      });
    });
  });
}

// EXPORT: db object is imported by server.js and all controllers
module.exports = db;
