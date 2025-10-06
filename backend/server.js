const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database configuration for XAMPP
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'luct_reporting_system', // Specify database here
  port: 3306,
};

// Create connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection and create database
const initializeDatabase = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('❌ Database connection failed: ', err.message);
      console.log('🔄 Retrying connection in 5 seconds...');
      setTimeout(initializeDatabase, 5000);
      return;
    }
    
    console.log('✅ Connected to MySQL successfully!');
    
    // Create database if it doesn't exist
    connection.query('CREATE DATABASE IF NOT EXISTS luct_reporting_system', (err) => {
      if (err) {
        console.log('❌ Error creating database:', err.message);
        connection.release();
        return;
      }
      
      console.log('✅ Database "luct_reporting_system" created or already exists');
      
      // Switch to the database
      connection.changeUser({database: 'luct_reporting_system'}, (err) => {
        if (err) {
          console.log('❌ Error switching to database:', err.message);
          connection.release();
          return;
        }
        
        console.log('✅ Using database: luct_reporting_system');
        connection.release();
        createTables();
      });
    });
  });
};

const createTables = () => {
  console.log('🔄 Creating tables...');

  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role ENUM('student', 'lecturer', 'principal_lecturer', 'program_leader') NOT NULL,
      stream VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const coursesTable = `
    CREATE TABLE IF NOT EXISTS courses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      course_name VARCHAR(255) NOT NULL,
      course_code VARCHAR(50) UNIQUE NOT NULL,
      stream VARCHAR(255) NOT NULL,
      assigned_lecturer_id INT,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const classesTable = `
    CREATE TABLE IF NOT EXISTS classes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      class_name VARCHAR(255) NOT NULL,
      stream VARCHAR(255) NOT NULL,
      total_students INT DEFAULT 0,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const reportsTable = `
    CREATE TABLE IF NOT EXISTS reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      faculty_name VARCHAR(255) NOT NULL,
      class_name VARCHAR(255) NOT NULL,
      week_of_reporting VARCHAR(50) NOT NULL,
      date_of_lecture DATE NOT NULL,
      course_name VARCHAR(255) NOT NULL,
      course_code VARCHAR(50) NOT NULL,
      lecturer_name VARCHAR(255) NOT NULL,
      actual_students_present INT NOT NULL,
      total_registered_students INT NOT NULL,
      venue VARCHAR(255) NOT NULL,
      scheduled_time TIME NOT NULL,
      topic_taught TEXT NOT NULL,
      learning_outcomes TEXT NOT NULL,
      lecturer_recommendations TEXT,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const feedbackTable = `
    CREATE TABLE IF NOT EXISTS feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      report_id INT NOT NULL,
      principal_lecturer_id INT NOT NULL,
      feedback_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const ratingsTable = `
    CREATE TABLE IF NOT EXISTS ratings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      course_id INT,
      lecturer_id INT,
      student_id INT,
      rating INT NOT NULL,
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const tables = [
    { name: 'users', sql: usersTable },
    { name: 'courses', sql: coursesTable },
    { name: 'classes', sql: classesTable },
    { name: 'reports', sql: reportsTable },
    { name: 'feedback', sql: feedbackTable },
    { name: 'ratings', sql: ratingsTable }
  ];

  const createTableSequentially = (index) => {
    if (index >= tables.length) {
      console.log('✅ All tables created successfully');
      insertSampleData();
      return;
    }

    const table = tables[index];
    pool.query(table.sql, (err) => {
      if (err) {
        console.log(`❌ Error creating ${table.name} table:`, err.message);
      } else {
        console.log(`✅ ${table.name} table ready`);
      }
      createTableSequentially(index + 1);
    });
  };

  createTableSequentially(0);
};

// Insert sample data with proper database context
const insertSampleData = () => {
  console.log('🔄 Inserting sample data...');

  // First ensure we're using the correct database
  pool.query('USE luct_reporting_system', (err) => {
    if (err) {
      console.log('❌ Error using database for sample data:', err.message);
      return;
    }

    console.log('✅ Database context set for sample data insertion');

    // Sample users
    const sampleUsers = [
      ['student@luct.ac.ls', 'password', 'John Student', 'student', 'BIT'],
      ['lecturer@luct.ac.ls', 'password', 'Dr. Smith Lecturer', 'lecturer', 'BIT'],
      ['prl@luct.ac.ls', 'password', 'Prof. PRL User', 'principal_lecturer', 'BIT'],
      ['pl@luct.ac.ls', 'password', 'Dr. PL User', 'program_leader', 'BIT']
    ];

    let userCount = 0;
    sampleUsers.forEach((user) => {
      pool.query(
        'INSERT IGNORE INTO users (email, password, name, role, stream) VALUES (?, ?, ?, ?, ?)',
        user,
        (err) => {
          if (err) {
            console.log('❌ Error inserting user:', err.message);
          } else {
            userCount++;
            console.log(`✅ Sample user inserted: ${user[2]}`);
          }
          
          if (userCount === sampleUsers.length) {
            insertSampleCourses();
          }
        }
      );
    });
  });
};

const insertSampleCourses = () => {
  const sampleCourses = [
    ['Web Application Development', 'DIWA2110', 'BIT', 2, 4],
    ['Database Systems', 'DBSY2110', 'BIT', 2, 4],
    ['Network Fundamentals', 'NTFU2110', 'BIT', 2, 4]
  ];

  let courseCount = 0;
  sampleCourses.forEach((course) => {
    pool.query(
      'INSERT IGNORE INTO courses (course_name, course_code, stream, assigned_lecturer_id, created_by) VALUES (?, ?, ?, ?, ?)',
      course,
      (err) => {
        if (err) {
          console.log('❌ Error inserting course:', err.message);
        } else {
          courseCount++;
          console.log(`✅ Sample course inserted: ${course[0]}`);
        }
        
        if (courseCount === sampleCourses.length) {
          insertSampleClasses();
        }
      }
    );
  });
};

const insertSampleClasses = () => {
  const sampleClasses = [
    ['BIT-1A', 'BIT', 45, 4],
    ['BIT-1B', 'BIT', 42, 4],
    ['BIT-2A', 'BIT', 38, 4]
  ];

  let classCount = 0;
  sampleClasses.forEach((cls) => {
    pool.query(
      'INSERT IGNORE INTO classes (class_name, stream, total_students, created_by) VALUES (?, ?, ?, ?)',
      cls,
      (err) => {
        if (err) {
          console.log('❌ Error inserting class:', err.message);
        } else {
          classCount++;
          console.log(`✅ Sample class inserted: ${cls[0]}`);
        }
        
        if (classCount === sampleClasses.length) {
          insertSampleReports();
        }
      }
    );
  });
};

const insertSampleReports = () => {
  const sampleReports = [
    [
      'Faculty of Information Communication Technology',
      'BIT-1A',
      'Week 6',
      '2024-10-15',
      'Web Application Development',
      'DIWA2110',
      'Dr. Smith Lecturer',
      35,
      45,
      'Room 101',
      '10:00:00',
      'React Components and State Management',
      'Students learned how to create functional components and manage state using hooks',
      'More practical examples needed for state management concepts',
      2
    ],
    [
      'Faculty of Information Communication Technology',
      'BIT-1B',
      'Week 6',
      '2024-10-16',
      'Database Systems',
      'DBSY2110',
      'Dr. Smith Lecturer',
      38,
      42,
      'Lab 3',
      '14:00:00',
      'SQL Queries and Database Normalization',
      'Students understood basic SQL queries and normalization concepts',
      'Students should practice more complex JOIN queries',
      2
    ],
    [
      'Faculty of Information Communication Technology',
      'BIT-2A',
      'Week 6',
      '2024-10-17',
      'Network Fundamentals',
      'NTFU2110',
      'Dr. Smith Lecturer',
      32,
      38,
      'Room 201',
      '09:00:00',
      'TCP/IP Protocol Suite',
      'Students learned about TCP/IP layers and their functions',
      'Need more hands-on networking exercises',
      2
    ]
  ];

  let reportCount = 0;
  sampleReports.forEach((report) => {
    pool.query(
      `INSERT IGNORE INTO reports (
        faculty_name, class_name, week_of_reporting, date_of_lecture,
        course_name, course_code, lecturer_name, actual_students_present,
        total_registered_students, venue, scheduled_time, topic_taught,
        learning_outcomes, lecturer_recommendations, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      report,
      (err) => {
        if (err) {
          console.log('❌ Error inserting report:', err.message);
        } else {
          reportCount++;
          console.log(`✅ Sample report inserted: ${report[4]} - ${report[1]}`);
        }
        
        if (reportCount === sampleReports.length) {
          insertSampleFeedback();
        }
      }
    );
  });
};

const insertSampleFeedback = () => {
  const sampleFeedback = [
    [1, 3, 'Good report overall. The learning outcomes are clearly defined. Consider adding more interactive activities for better student engagement.'],
    [2, 3, 'Excellent coverage of SQL concepts. The practical examples were well received by students. Continue with this approach.'],
    [3, 3, 'Good introduction to TCP/IP. Consider adding more real-world examples to make the concepts more relatable.']
  ];

  let feedbackCount = 0;
  sampleFeedback.forEach((feedback) => {
    pool.query(
      'INSERT IGNORE INTO feedback (report_id, principal_lecturer_id, feedback_text) VALUES (?, ?, ?)',
      feedback,
      (err) => {
        if (err) {
          console.log('❌ Error inserting feedback:', err.message);
        } else {
          feedbackCount++;
          console.log(`✅ Sample feedback inserted for report ${feedback[0]}`);
        }
        
        if (feedbackCount === sampleFeedback.length) {
          console.log('🎉 Database setup completed successfully!');
          console.log('📋 Sample accounts created:');
          console.log('   Student: student@luct.ac.ls / password');
          console.log('   Lecturer: lecturer@luct.ac.ls / password');
          console.log('   Principal Lecturer: prl@luct.ac.ls / password');
          console.log('   Program Leader: pl@luct.ac.ls / password');
        }
      }
    );
  });
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  pool.query('SELECT 1', (err) => {
    if (err) {
      return res.status(500).json({ 
        status: 'Database connection failed', 
        error: err.message 
      });
    }
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      message: 'LUCT Reporting System API is running'
    });
  });
});

// Auth Routes
app.post('/api/register', (req, res) => {
  const { email, password, name, role, stream } = req.body;
  
  const query = 'INSERT INTO users (email, password, name, role, stream) VALUES (?, ?, ?, ?, ?)';
  pool.query(query, [email, password, name, role, stream], (err, result) => {
    if (err) {
      return res.status(400).json({ error: 'Registration failed: ' + err.message });
    }
    res.json({ message: 'User registered successfully', userId: result.insertId });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  pool.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = results[0];
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        stream: user.stream
      }
    });
  });
});

// Courses Routes
app.get('/api/courses', (req, res) => {
  const { stream, userRole } = req.query;
  
  let query = `
    SELECT c.*, u.name as lecturer_name 
    FROM courses c 
    LEFT JOIN users u ON c.assigned_lecturer_id = u.id
  `;
  let params = [];

  // For principal_lecturer, show courses in their stream
  if (userRole === 'principal_lecturer' && stream) {
    query += ' WHERE c.stream = ?';
    params.push(stream);
  } 
  // For program_leader, show all courses they created or all if no filter
  else if (userRole === 'program_leader' && stream) {
    query += ' WHERE c.stream = ?';
    params.push(stream);
  }
  // For other roles or no specific filter
  else if (stream) {
    query += ' WHERE c.stream = ?';
    params.push(stream);
  }

  console.log('Courses query:', query, 'Params:', params);

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error('Courses query error:', err);
      return res.status(500).json({ error: 'Failed to fetch courses: ' + err.message });
    }
    res.json(results);
  });
});

app.post('/api/courses', (req, res) => {
  const { course_name, course_code, stream, assigned_lecturer_id, created_by } = req.body;
  
  const query = 'INSERT INTO courses (course_name, course_code, stream, assigned_lecturer_id, created_by) VALUES (?, ?, ?, ?, ?)';
  pool.query(query, [course_name, course_code, stream, assigned_lecturer_id, created_by], (err, result) => {
    if (err) {
      return res.status(400).json({ error: 'Failed to create course: ' + err.message });
    }
    res.json({ message: 'Course created successfully', courseId: result.insertId });
  });
});

// Classes Routes
app.get('/api/classes', (req, res) => {
  const { stream } = req.query;
  let query = 'SELECT * FROM classes';
  let params = [];

  if (stream) {
    query += ' WHERE stream = ?';
    params.push(stream);
  }

  pool.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch classes: ' + err.message });
    }
    res.json(results);
  });
});

app.post('/api/classes', (req, res) => {
  const { class_name, stream, total_students, created_by } = req.body;
  
  const query = 'INSERT INTO classes (class_name, stream, total_students, created_by) VALUES (?, ?, ?, ?)';
  pool.query(query, [class_name, stream, total_students, created_by], (err, result) => {
    if (err) {
      return res.status(400).json({ error: 'Failed to create class: ' + err.message });
    }
    res.json({ message: 'Class created successfully', classId: result.insertId });
  });
});

// Reports Routes
app.get('/api/reports', (req, res) => {
  const { search, userRole, userId, stream } = req.query;
  
  let query = `
    SELECT r.*, u.name as creator_name 
    FROM reports r 
    LEFT JOIN users u ON r.created_by = u.id
  `;
  let params = [];

  // Build WHERE conditions
  const conditions = [];

  if (search) {
    conditions.push(`(r.course_name LIKE ? OR r.lecturer_name LIKE ? OR r.class_name LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (userRole === 'lecturer') {
    conditions.push(`r.created_by = ?`);
    params.push(userId);
  }

  // For principal_lecturer, filter by faculty name containing their stream
  if (userRole === 'principal_lecturer' && stream) {
    conditions.push(`r.faculty_name LIKE ?`);
    params.push(`%${stream}%`);
  }

  // Add WHERE clause if there are conditions
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  console.log('Reports query:', query, 'Params:', params);

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error('Reports query error:', err);
      return res.status(500).json({ error: 'Failed to fetch reports: ' + err.message });
    }
    res.json(results);
  });
});

app.post('/api/reports', (req, res) => {
  const {
    faculty_name, class_name, week_of_reporting, date_of_lecture,
    course_name, course_code, lecturer_name, actual_students_present,
    total_registered_students, venue, scheduled_time, topic_taught,
    learning_outcomes, lecturer_recommendations, created_by
  } = req.body;

  const query = `
    INSERT INTO reports (
      faculty_name, class_name, week_of_reporting, date_of_lecture,
      course_name, course_code, lecturer_name, actual_students_present,
      total_registered_students, venue, scheduled_time, topic_taught,
      learning_outcomes, lecturer_recommendations, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(query, [
    faculty_name, class_name, week_of_reporting, date_of_lecture,
    course_name, course_code, lecturer_name, actual_students_present,
    total_registered_students, venue, scheduled_time, topic_taught,
    learning_outcomes, lecturer_recommendations, created_by
  ], (err, result) => {
    if (err) {
      return res.status(400).json({ error: 'Failed to create report: ' + err.message });
    }
    res.json({ message: 'Report created successfully', reportId: result.insertId });
  });
});

app.get('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT r.*, u.name as creator_name 
    FROM reports r 
    LEFT JOIN users u ON r.created_by = u.id 
    WHERE r.id = ?
  `;
  
  pool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch report: ' + err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    const report = results[0];

    // Get feedback for this report
    pool.query(
      `SELECT f.*, u.name as principal_lecturer_name, u.role
       FROM feedback f 
       LEFT JOIN users u ON f.principal_lecturer_id = u.id 
       WHERE f.report_id = ? 
       ORDER BY f.created_at DESC`,
      [id],
      (err, feedbackResults) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch feedback' });
        }

        res.json({
          ...report,
          feedback: feedbackResults
        });
      }
    );
  });
});

// Feedback Routes
app.post('/api/feedback', (req, res) => {
  const { report_id, principal_lecturer_id, feedback_text } = req.body;
  
  // First, verify the report exists
  pool.query('SELECT * FROM reports WHERE id = ?', [report_id], (err, reportResults) => {
    if (err || reportResults.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Verify the user is a principal lecturer
    pool.query('SELECT * FROM users WHERE id = ? AND role = "principal_lecturer"', [principal_lecturer_id], (err, userResults) => {
      if (err || userResults.length === 0) {
        return res.status(403).json({ error: 'Only principal lecturers can add feedback' });
      }

      // Insert feedback
      const query = 'INSERT INTO feedback (report_id, principal_lecturer_id, feedback_text) VALUES (?, ?, ?)';
      pool.query(query, [report_id, principal_lecturer_id, feedback_text], (err, result) => {
        if (err) {
          return res.status(400).json({ error: 'Failed to add feedback: ' + err.message });
        }

        // Return the created feedback with user details
        pool.query(
          `SELECT f.*, u.name as principal_lecturer_name 
           FROM feedback f 
           LEFT JOIN users u ON f.principal_lecturer_id = u.id 
           WHERE f.id = ?`,
          [result.insertId],
          (err, feedbackResults) => {
            if (err) {
              return res.json({ 
                message: 'Feedback added successfully', 
                feedbackId: result.insertId 
              });
            }
            res.json({ 
              message: 'Feedback added successfully', 
              feedback: feedbackResults[0] 
            });
          }
        );
      });
    });
  });
});

app.get('/api/feedback/report/:reportId', (req, res) => {
  const { reportId } = req.params;
  
  const query = `
    SELECT f.*, u.name as principal_lecturer_name, u.role
    FROM feedback f 
    LEFT JOIN users u ON f.principal_lecturer_id = u.id 
    WHERE f.report_id = ? 
    ORDER BY f.created_at DESC
  `;
  
  pool.query(query, [reportId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch feedback: ' + err.message });
    }
    res.json(results);
  });
});

// Ratings Routes
app.post('/api/ratings', (req, res) => {
  const { course_id, lecturer_id, student_id, rating, comment } = req.body;
  
  const query = 'INSERT INTO ratings (course_id, lecturer_id, student_id, rating, comment) VALUES (?, ?, ?, ?, ?)';
  pool.query(query, [course_id, lecturer_id, student_id, rating, comment], (err, result) => {
    if (err) {
      return res.status(400).json({ error: 'Failed to submit rating: ' + err.message });
    }
    res.json({ message: 'Rating submitted successfully' });
  });
});

app.get('/api/ratings', (req, res) => {
  const query = `
    SELECT r.*, c.course_name, u.name as lecturer_name, s.name as student_name
    FROM ratings r
    LEFT JOIN courses c ON r.course_id = c.id
    LEFT JOIN users u ON r.lecturer_id = u.id
    LEFT JOIN users s ON r.student_id = s.id
  `;
  
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch ratings: ' + err.message });
    }
    res.json(results);
  });
});

// Get lecturers for assignment
app.get('/api/lecturers', (req, res) => {
  const query = 'SELECT id, name, email FROM users WHERE role = "lecturer"';
  
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch lecturers: ' + err.message });
    }
    res.json(results);
  });
});

// Get all users (for admin purposes)
app.get('/api/users', (req, res) => {
  const query = 'SELECT id, name, email, role, stream, created_at FROM users';
  
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users: ' + err.message });
    }
    res.json(results);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 LUCT Reporting System API`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log('🔄 Initializing database...');
  initializeDatabase();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  pool.end((err) => {
    if (err) {
      console.log('Error closing database connections:', err);
    } else {
      console.log('✅ Database connections closed');
    }
    process.exit(0);
  });
});