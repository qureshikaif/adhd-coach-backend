import { Pool } from "pg";
import "dotenv/config";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createTable = async (tableName, columns) => {
  const result = await pool.query(
    `
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_name = $1
        )
    `,
    [tableName]
  );
  const tableExists = result.rows[0].exists;
  if (!tableExists) {
    await pool.query(`CREATE TABLE ${tableName} (${columns})`);
  }
};

// Users table (common for all user types)
createTable(
  "users",
  `id SERIAL PRIMARY KEY,
   full_name TEXT NOT NULL,
   email TEXT UNIQUE NOT NULL,
   password TEXT NOT NULL,
   role TEXT NOT NULL CHECK (role IN ('admin', 'parent', 'teacher', 'doctor', 'student'))`
);

// Admin table
createTable(
  "admin",
  `id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id)`
);

// Parent table
createTable(
  "parents",
  `id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id),
   child_id INT REFERENCES students(id)`
);

// Teacher table
createTable(
  "teachers",
  `id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id)`
);

// Doctor table
createTable(
  "doctors",
  `id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id)`
);

// Student table
createTable(
  "students",
  `id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id)`
);

// Courses table
createTable(
  "courses",
  `id SERIAL PRIMARY KEY,
   name TEXT,
   description TEXT,
   instructor INT REFERENCES teachers(id),
   rating TEXT,
   students TEXT`
);

// Articles table
createTable(
  "articles",
  `id SERIAL PRIMARY KEY,
   title TEXT,
   subtitle TEXT,
   tags TEXT,
   content TEXT,
   summary TEXT,
   admin_id INT REFERENCES admins(id)`
);

// Chats table
createTable(
  "chats",
  `id SERIAL PRIMARY KEY,
   sender_id INT REFERENCES users(id),
   receiver_id INT REFERENCES users(id),
   message TEXT,
   timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
);

// Appointments table
createTable(
  "appointments",
  `id SERIAL PRIMARY KEY,
   doctor_id INT REFERENCES doctors(id),
   student_id INT REFERENCES students(id),
   time TIMESTAMP,
   reason TEXT`
);

// Reviews table
createTable(
  "reviews",
  `id SERIAL PRIMARY KEY,
   course_id INT REFERENCES courses(id),
   user_id INT REFERENCES users(id),
   rating INT,
   comment TEXT`
);

// Assessments table
createTable(
  "assessments",
  `id SERIAL PRIMARY KEY,
   student_id INT REFERENCES students(id),
   score INT,
   date TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
);

export { pool };
