// This connects to SQLite and creates tables if they don’t exist.

const sqlite3 = require('sqlite3').verbose(); // This basically imports the library for working with SQLite databases in Node.js. 
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

// This function creates the necessary tables for our application if they don't already exist.
// It is the main function that sets up our database schema. 
// It creates three tables: users, habits, and habitRecords. Each table has its own set of columns and constraints.
function initializeDatabase() {
  // Drop existing tables to start fresh for demo (in reverse order due to foreign keys)
  db.run('DROP TABLE IF EXISTS habitRecords', (err) => {
    if (err) console.error('Error dropping habitRecords table:', err);
    db.run('DROP TABLE IF EXISTS habits', (err) => {
      if (err) console.error('Error dropping habits table:', err);
      db.run('DROP TABLE IF EXISTS users', (err) => {
        if (err) console.error('Error dropping users table:', err);
        // Now create tables
        db.run(`
          CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) console.error('Error creating users table:', err);
          else console.log('Users table ready');
          // Create habits table
          db.run(`
            CREATE TABLE habits (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId INTEGER NOT NULL,
              name TEXT NOT NULL,
              category TEXT DEFAULT 'general',
              description TEXT,
              image LONGTEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )
          `, (err) => {
            if (err) console.error('Error creating habits table:', err);
            else console.log('Habits table ready');
            // Create habitRecords table
            db.run(`
              CREATE TABLE habitRecords (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                habitId INTEGER NOT NULL,
                date DATE NOT NULL,
                completed INTEGER DEFAULT 0,
                notes TEXT,
                FOREIGN KEY (habitId) REFERENCES habits(id) ON DELETE CASCADE,
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
}

// Finally, we export the db object so that other parts of our application can use it to interact with the database. 
module.exports = db;

// In summary, this file sets up a connection to a SQLite database, 
// creates the necessary tables for our habit tracking application, 
// and exports the database connection for use in other parts of the backend.
