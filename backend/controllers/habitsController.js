const db = require('../database'); // importing the SQLite database instance. Allowing interaction with it and performing CRUD ops

// getHabits retrieves all habits for the authenticated user. 
// uses userID from the JWT token (set by verifyToken middleware) to query the database for habits that belong to that user.
exports.getHabits = (req, res) => {
  const userId = req.userId; // here is the userID.

  // Here is the query to get all habits for the user. all has the structure: all(query, params, callback).
  db.all(
    'SELECT id, name, category, description, image, createdAt FROM habits WHERE userId = ? ORDER BY createdAt DESC',
    [userId],

    // here's the callback function. Handles the response from the query. If there's an error, sends 500 status with error.
    (err, habits) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(habits); // then sends the habits as a JSON response. This will be an array of habit objects that belong to the authenticated user.
    }
  );
};

// now, createHabit, deleteHabit and updateHabit are defined below. They all follow a similar pattern:
// 1. Get userId from req.userId (set by verifyToken middleware).
// 2. Perform necessary validation on the input data.
// 3. Interact with the database to create, delete or update a habit.
// 4. Handle errors and send appropriate JSON responses back to the client.
exports.createHabit = (req, res) => {
  const userId = req.userId; 
  const { name, category, description, image } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Habit name is required' });
  }

  db.run(
    'INSERT INTO habits (userId, name, category, description, image) VALUES (?, ?, ?, ?, ?)',
    [userId, name, category || 'general', description || null, image || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ 
        id: this.lastID, 
        name, 
        category, 
        description, 
        image,
        createdAt: new Date().toISOString()
      });
    }
  );
};

// deleteHabit. This function deletes a habit by its ID, but only if it belongs to the authenticated user.
exports.deleteHabit = (req, res) => {
  const userId = req.userId;
  const habitId = req.params.id; // we're saying "get the id from the URL parameters (e.g., /api/habits/:id), pass it to the variable habitId". so this may have something like 
  // "/1" or "/2" depending on which habit we want to delete.

  // db.get is used to check if the habit exists and belongs to the user before attempting to delete it. 
  // This is important for security, to ensure that users can only delete their own habits. 
  // If the habit doesn't exist or doesn't belong to the user, it sends a 404 Not Found response. 
  // If it does exist and belongs to the user, it proceeds to delete it from the database.
  db.get('SELECT id FROM habits WHERE id = ? AND userId = ?', [habitId, userId], (err, habit) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // after the checks, we run the delete query.
    db.run('DELETE FROM habits WHERE id = ?', [habitId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Habit deleted' }); // if successful, it sends a JSON response with a success message.
    });
  });
};

// updating habits. 
exports.updateHabit = (req, res) => {
  const userId = req.userId;
  const habitId = req.params.id;
  const { name, category, description, image } = req.body;

  db.get('SELECT id FROM habits WHERE id = ? AND userId = ?', [habitId, userId], (err, habit) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    db.run(
      'UPDATE habits SET name = ?, category = ?, description = ?, image = ? WHERE id = ?',
      [name || null, category || null, description || null, image || null, habitId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Habit updated' });
      }
    );
  });
};

// in summary, this controller file defines the logic for handling CRUD operations on habits.
// Each function interacts with the database to perform the necessary operations 
// while ensuring that users can only access and modify their own habits.
// The functions also handle errors gracefully and send appropriate JSON responses back to the client,
// which the frontend can then use to update the UI accordingly.