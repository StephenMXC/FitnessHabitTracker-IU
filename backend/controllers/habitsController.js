// ============================================
// HABITS CONTROLLER
// ============================================
// PURPOSE: Handle habit CRUD operations (Create, Read, Update, Delete)
// SECURITY: All functions use req.userId (set by verifyToken middleware) to ensure
//          users only access their own habits.
// PATTERN: Each function validates input → checks ownership → performs DB operation → returns result
// ============================================

const db = require('../database');

// GET ALL HABITS: Retrieve all habits for authenticated user
// Receives: JWT token in headers (via verifyToken middleware) → req.userId is set
// Returns: Array of habit objects sorted by creation date (newest first)
exports.getHabits = (req, res) => {
  const userId = req.userId; // Set by verifyToken middleware from JWT token

  db.all(
    'SELECT id, name, category, description, image, createdAt FROM habits WHERE userId = ? ORDER BY createdAt DESC',
    [userId],
    (err, habits) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(habits); // Return array of habits
    }
  );
};

// CREATE HABIT: Add new habit for authenticated user
// Receives: { name (required), category, description, image }
// Returns: New habit object with id and createdAt timestamp
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

// DELETE HABIT: Remove habit by ID (security: only if belongs to current user)
// Receives: habitId from URL parameter (/habits/:id)
// Returns: Success message on deletion
// Security: Verifies habit belongs to user before deleting
exports.deleteHabit = (req, res) => {
  const userId = req.userId;
  const habitId = req.params.id;

  // First verify habit exists and belongs to this user (security check)
  db.get('SELECT id FROM habits WHERE id = ? AND userId = ?', [habitId, userId], (err, habit) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Delete the habit
    db.run('DELETE FROM habits WHERE id = ?', [habitId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Habit deleted' });
    });
  });
};

// UPDATE HABIT: Modify habit details (security: only if belongs to current user)
// Receives: habitId from URL, { name, category, description, image } in body
// Returns: Success message on update
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

// MARK HABIT COMPLETE: Toggle habit completion status for today
// Receives: habitId from URL, { completed: boolean } in body
// Returns: Success message on update
// Stores in habitRecords table for tracking daily completions
exports.markHabitComplete = (req, res) => {
  const userId = req.userId;
  const habitId = req.params.id;
  const { completed } = req.body; // true = completed today, false = not completed

  // Verify habit belongs to this user (security check)
  db.get('SELECT id FROM habits WHERE id = ? AND userId = ?', [habitId, userId], (err, habit) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Insert or update habitRecord for today (upsert pattern)
    db.run(
      `INSERT INTO habitRecords (habitId, date, completed)
       VALUES (?, ?, ?)
       ON CONFLICT(habitId, date) DO UPDATE SET completed = ?`,
      [habitId, today, completed ? 1 : 0, completed ? 1 : 0],
      (err) => {
        if (err) {
          console.error('Error marking habit complete:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: 'Habit status updated' });
      }
    );
  });
};