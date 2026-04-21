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
    
    // Get the last 7 days of activity to calculate weekly completion rate
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

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

        // Get daily completion data for the past 7 days (for weekly completion rate and highlighting)
        db.all(
          `SELECT date, isFullyCompleted 
           FROM dailyCompletion 
           WHERE userId = ? AND date >= ? AND date <= ?
           ORDER BY date ASC`,
          [userId, sevenDaysAgoStr, today],
          (err, dailyCompletions) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }

            // Build a map of dates with 100% completion
            const completedDatesMap = {};
            if (dailyCompletions) {
              dailyCompletions.forEach(record => {
                completedDatesMap[record.date] = record.isFullyCompleted === 1;
              });
            }

            // Determine which days of the week had 100% completion
            const weeklyCompletion = [false, false, false, false, false, false, false]; // M-Sun
            let completedDaysCount = 0;

            for (let i = 0; i < 7; i++) {
              const checkDate = new Date();
              checkDate.setDate(checkDate.getDate() - (6 - i));
              const checkDateStr = checkDate.toISOString().split('T')[0];
              const isCompleted = completedDatesMap[checkDateStr] === true;
              
              // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
              const dayOfWeek = checkDate.getDay();
              
              // Convert to our frontend format (0 = Monday, 1 = Tuesday, ..., 6 = Sunday)
              const frontendDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
              
              weeklyCompletion[frontendDayIndex] = isCompleted;
              if (isCompleted) completedDaysCount++;
            }

            // Calculate completion rate: percentage of days in the week with 100% completion
            const weeklyCompletionRate = Math.round((completedDaysCount / 7) * 100);

            // Count today's completed habits
            const completedToday = habitsResult.filter(h => h.completed === 1).length;

            // Return comprehensive stats
            res.json({
              totalHabits: totalResult.total,
              completedToday: completedToday,
              completionRate: weeklyCompletionRate, // Now shows weekly completion percentage
              habits: habitsResult,
              weeklyCompletion: weeklyCompletion, // Array of 7 booleans for M-Sun (100% completion status)
              completedDaysThisWeek: completedDaysCount,
            });
          }
        );
      }
    );
  });
};

// Mark a day as 100% completed
exports.markDailyCompletion = (req, res) => {
  const userId = req.userId;
  const { date, isFullyCompleted } = req.body;

  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  // Upsert into dailyCompletion table
  db.run(
    `INSERT INTO dailyCompletion (userId, date, isFullyCompleted) 
     VALUES (?, ?, ?)
     ON CONFLICT(userId, date) DO UPDATE SET isFullyCompleted = ?`,
    [userId, date, isFullyCompleted ? 1 : 0, isFullyCompleted ? 1 : 0],
    (err) => {
      if (err) {
        console.error('Error marking daily completion:', err);
        return res.status(500).json({ error: 'Failed to mark completion' });
      }
      res.json({ success: true, message: 'Daily completion marked' });
    }
  );
};

// in summary, 
// the getDashboardStats function retrieves statistics for the user's dashboard,
// including the total number of habits, completion rate based on weekly 100% completion,
// today's habits, and weekly activity. It uses SQL queries to get this data from the database 
// and sends it back as a JSON response.
// The markDailyCompletion function saves when a day has 100% completion for the user.