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
  // userId is automatically set by verifyToken middleware on protected routes
  // verifyToken extracts userId from JWT token in Authorization header
  const userId = req.userId;

  // Query database for all habits belonging to this user
  // ORDER BY createdAt DESC = show newest habits first (reverse chronological)
  // ? placeholder prevents SQL injection attacks
  db.all(
    'SELECT id, name, category, description, image, createdAt FROM habits WHERE userId = ? ORDER BY createdAt DESC',
    [userId],
    (err, habits) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      // Return array of habits (empty array if user has no habits)
      res.json(habits);
    }
  );
};

// CREATE HABIT: Add new habit for authenticated user
// Receives: { name (required), category, description, image }
// Returns: New habit object with id and createdAt timestamp
exports.createHabit = (req, res) => {
  const userId = req.userId;  // Set by verifyToken middleware
  const { name, category, description, image } = req.body;

  // === VALIDATION ===
  // Habit name is required - can't create habit without a name
  if (!name) {
    return res.status(400).json({ error: 'Habit name is required' });
  }

  // === DATABASE INSERTION ===
  // Insert new habit with default category 'general' if not provided
  // image can be base64 encoded image data (stored as LONGTEXT)
  // ? placeholders prevent SQL injection
  db.run(
    'INSERT INTO habits (userId, name, category, description, image) VALUES (?, ?, ?, ?, ?)',
    [userId, name, category || 'general', description || null, image || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      // === RESPONSE ===
      // this.lastID = auto-generated habit ID from SQLite AUTOINCREMENT
      // Return 201 (Created) status with full habit object including new ID
      res.status(201).json({ 
        id: this.lastID,         // New habit's auto-generated ID
        name, 
        category: category || 'general', 
        description: description || null, 
        image: image || null,
        createdAt: new Date().toISOString()  // Current timestamp in ISO format
      });
    }
  );
};

// DELETE HABIT: Remove habit by ID (security: only if belongs to current user)
// Receives: habitId from URL parameter (/habits/:id)
// Returns: Success message on deletion
// Security: Verifies habit belongs to user before deleting (ownership check)
exports.deleteHabit = (req, res) => {
  const userId = req.userId;      // Current user ID from JWT token
  const habitId = req.params.id;  // Habit ID from URL parameter

  // === OWNERSHIP VERIFICATION ===
  // First verify that habit exists AND belongs to current user
  // This prevents user A from deleting user B's habits via direct URL manipulation
  // WHERE clause checks both id AND userId to ensure ownership
  db.get('SELECT id FROM habits WHERE id = ? AND userId = ?', [habitId, userId], (err, habit) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // If no habit found matching both id AND userId, return 404
    // This also protects privacy (don't reveal if another user owns the habit)
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // === DELETION ===
    // Delete the habit by ID only (already verified ownership above)
    // ON DELETE CASCADE in database schema will automatically delete:
    //   - All habitRecords for this habit (daily completion history)
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
  const userId = req.userId;      // Current user ID from JWT token
  const habitId = req.params.id;  // Habit ID from URL parameter
  const { name, category, description, image } = req.body;

  // === OWNERSHIP VERIFICATION ===
  // Check that habit exists and belongs to current user before updating
  // Prevents user A from modifying user B's habits
  db.get('SELECT id FROM habits WHERE id = ? AND userId = ?', [habitId, userId], (err, habit) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // If habit not found or doesn't belong to user, return 404
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // === UPDATE OPERATION ===
    // Update all provided fields; null values are allowed
    // Using ? placeholders prevents SQL injection
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
  const userId = req.userId;      // Current user ID from JWT token
  const habitId = req.params.id;  // Habit ID from URL parameter
  const { completed } = req.body; // true = mark complete, false = mark incomplete

  // === OWNERSHIP VERIFICATION ===
  // Verify habit exists and belongs to current user
  // Prevents user A from marking user B's habits as complete
  db.get('SELECT id FROM habits WHERE id = ? AND userId = ?', [habitId, userId], (err, habit) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // === GET TODAY'S DATE ===
    // Convert current datetime to YYYY-MM-DD format for consistent date handling
    // This ensures all entries for today use the same date string
    const today = new Date().toISOString().split('T')[0];

    // === UPSERT PATTERN ===
    // INSERT new record if doesn't exist, UPDATE if already exists
    // "ON CONFLICT" clause handles duplicate habitId + date combinations
    // UNIQUE(habitId, date) constraint in schema prevents duplicates
    // This is more efficient than checking and inserting/updating separately
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
        // Return success with completion status updated
        res.json({ success: true, message: 'Habit status updated' });
      }
    );
  });
};