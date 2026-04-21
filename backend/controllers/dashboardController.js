const db = require('../database'); // import the database connection.

exports.getDashboardStats = (req, res) => {
  const userId = req.userId; // extracting userID from request.

  // Get total habits count
  db.get('SELECT COUNT(*) as total FROM habits WHERE userId = ?', [userId], (err, totalResult) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Get habits completed today
    db.get(
      `SELECT COUNT(*) as completed FROM habitRecords hr 
       JOIN habits h ON hr.habitId = h.id 
       WHERE h.userId = ? AND hr.date = ? AND hr.completed = 1`,
      [userId, today],
      (err, completedResult) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        // Get all habits with their details and today's completion status
        db.all(
          `SELECT h.id, h.name, h.category, 
                  COALESCE(hr.completed, 0) as completed
           FROM habits h
           LEFT JOIN habitRecords hr ON h.id = hr.habitId AND hr.date = ?
           WHERE h.userId = ?
           ORDER BY h.createdAt DESC`,
          [today, userId],
          (err, habitsResult) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }

            // Calculate completion rate percentage
            const totalHabits = totalResult.total;
            const completedToday = completedResult.completed;
            const completionRate = totalHabits > 0 
              ? Math.round((completedToday / totalHabits) * 100) 
              : 0;

            // Get the last 7 days of activity to calculate weekly streak
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
            const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

            db.all(
              `SELECT DISTINCT DATE(hr.date) as date
               FROM habitRecords hr
               JOIN habits h ON hr.habitId = h.id
               WHERE h.userId = ? AND hr.completed = 1 
               AND hr.date >= ? AND hr.date <= ?
               ORDER BY hr.date DESC`,
              [userId, sevenDaysAgoStr, today],
              (err, weeklyDates) => {
                if (err) {
                  return res.status(500).json({ error: 'Database error' });
                }

                // Determine which days of the week had activity
                const weeklyActivity = [false, false, false, false, false, false, false]; // M-Sun
                const activeDates = new Set(weeklyDates.map(d => d.date));

                // Check each day of the week for activity
                for (let i = 0; i < 7; i++) {
                  const checkDate = new Date();
                  checkDate.setDate(checkDate.getDate() - (6 - i));
                  const checkDateStr = checkDate.toISOString().split('T')[0];
                  weeklyActivity[i] = activeDates.has(checkDateStr);
                }

                // Return comprehensive stats
                res.json({
                  totalHabits: totalHabits,
                  completedToday: completedToday,
                  completionRate: completionRate,
                  habits: habitsResult,
                  weeklyActivity: weeklyActivity, // Array of 7 booleans for M-Sun
                });
              }
            );
          }
        );
      }
    );
  });
};

// in summary, 
// the getDashboardStats function retrieves statistics for the user's dashboard,
// including the total number of habits, completion rate, today's habits,
// and weekly activity. It uses SQL queries to get this data from the database 
// and sends it back as a JSON response.