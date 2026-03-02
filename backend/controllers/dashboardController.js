const db = require('../database');

exports.getDashboardStats = (req, res) => {
  const userId = req.userId;

  // Get total habits count
  db.get('SELECT COUNT(*) as total FROM habits WHERE userId = ?', [userId], (err, totalResult) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Get habits completed today
    const today = new Date().toISOString().split('T')[0];
    db.get(
      `SELECT COUNT(*) as completed FROM habitRecords hr 
       JOIN habits h ON hr.habitId = h.id 
       WHERE h.userId = ? AND hr.date = ? AND hr.completed = 1`,
      [userId, today],
      (err, completedResult) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({
          totalHabits: totalResult.total,
          completedToday: completedResult.completed,
        });
      }
    );
  });
};
