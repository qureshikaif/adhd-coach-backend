import { Pool } from "pg";
import "dotenv/config";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const pool = new Pool({
  host: "localhost",
  database: "adhdcoach",
  user: "postgres",
  password: "db123",
  port: 5432,
});

// const pool = new Pool({
//   host: PGHOST,
//   database: PGDATABASE,
//   user: PGUSER,
//   password: PGPASSWORD,
//   port: 5432,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

const createTable = async (tableName: string, columns: string) => {
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

// Admin table
createTable(
  "admins",
  `id SERIAL PRIMARY KEY,
   full_name TEXT NOT NULL,
   email TEXT UNIQUE NOT NULL,
   password TEXT NOT NULL`
);

// Parent table

// Teacher table
createTable(
  "teachers",
  `id SERIAL PRIMARY KEY,
  id_assigned INT UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT UNIQUE,
  password TEXT`
);

// Doctor table
createTable(
  "doctors",
  `id SERIAL PRIMARY KEY,
  id_assigned INT,
  full_name TEXT,
   email TEXT UNIQUE,
   password TEXT`
);

// Student table
createTable(
  "students",
  `id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  id_assigned INT UNIQUE NOT NULL`
);

createTable(
  "parents",
  `id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
   email TEXT UNIQUE NOT NULL,
   password TEXT NOT NULL,   
   child_id INT REFERENCES students(id_assigned)`
);

// Courses table
createTable(
  "courses",
  `id SERIAL PRIMARY KEY,
   title TEXT,
   description TEXT,
   instructor INT REFERENCES teachers(id_assigned),
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
   summary TEXT`
);

// Chats table
// createTable(
//   "chats",
//   `id SERIAL PRIMARY KEY,
//    sender_id INT REFERENCES users(id),
//    receiver_id INT REFERENCES users(id),
//    message TEXT,
//    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
// );

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
   user_id INT REFERENCES students(id),
   rating INT,
   comment TEXT`
);

// Assessments table
createTable(
  "main_assessment",
  `id SERIAL PRIMARY KEY,
   score INT,
   date TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
);

createTable(
  "assessments",
  `id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(id),
  score INT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type TEXT`
);

export default pool;
