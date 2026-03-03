const db = require('../database'); // import the database connection.

exports.getDashboardStats = (req, res) => {
  const userId = req.userId; // extracting userID from request.

  // Get total habits count
  // again, get is structured as: db.get('SQL_QUERY', [parameters], callback). 
  // We're counting the total number of habits for the user. So the query's result will be
  // something like "total": 5, where 5 is the total number of habits for that user. then userID could be
  // something like 1, 2, etc. depending on the user. and the callback will 
  // handle the result of the query.
  db.get('SELECT COUNT(*) as total FROM habits WHERE userId = ?', [userId], (err, totalResult) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Get habits completed today
    // 'today' is assigned the current data, converted to ISO string format, and then split
    //  to get just the date part (YYYY-MM-DD). the "T" is used
    //  as a separator between the date and time in the ISO format,
    //  so splitting by "T" gives us an array where the first element is the date and the second element
    //  is the time. By taking the first element (index 0), we get just the date in the 
    //  desired format.
    const today = new Date().toISOString().split('T')[0];
    
    // just like before, we're using db.get to execute a SQL query. 
    // This query counts the number of habit records (hr) that are joined 
    // with the habits (h) table, where the userId matches the current user, 
    // the date matches today, and the completed status is 1 
    // (indicating that the habit was completed). 
    // The result will be something like "completed": 3, 
    // where 3 is the number of habits completed today for that user. 
    // The callback function will handle the result of this query and send a 
    // JSON response containing both the total number of habits and the number of habits completed today.
    db.get(
      `SELECT COUNT(*) as completed FROM habitRecords hr 
       JOIN habits h ON hr.habitId = h.id 
       WHERE h.userId = ? AND hr.date = ? AND hr.completed = 1`,
      [userId, today],
      (err, completedResult) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }


        // then, we return a JSON response.
        // the response will look like:
        // {
        //   "totalHabits": 5,
        //   "completedToday": 3
        // }
        res.json({
          totalHabits: totalResult.total,
          completedToday: completedResult.completed,
        });
      }
    );
  });
};


// in summary, 
// the getDashboardStats function retrieves statistics for the user's dashboard,
// including the total number of habits and the number of habits completed today.
// It uses SQL queries to get this data from the database and sends it back as a JSON response.
// so this file is responsible for providing the necessary data for the dashboard view in the frontend,
// allowing users to see an overview of their habits and progress.