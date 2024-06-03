import { Pool } from "pg";
import "dotenv/config";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// const pool = new Pool({
//   host: "localhost",
//   database: "adhdcoach",
//   user: "postgres",
//   password: "db123",
//   port: 5432,
// });

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
  image TEXT,
  full_name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  personal_info TEXT`
);

// Doctor table
createTable(
  "doctors",
  `id SERIAL PRIMARY KEY,
  id_assigned INT UNIQUE NOT NULL,
  image TEXT,
  full_name TEXT,
   email TEXT UNIQUE,
   password TEXT,
   personal_info TEXT`
);

// Student table
createTable(
  "students",
  `id SERIAL PRIMARY KEY,
  id_assigned INT UNIQUE NOT NULL,
  image TEXT,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  personal_info TEXT`
);

createTable(
  "parents",
  `id SERIAL PRIMARY KEY,
    image TEXT,
  full_name TEXT NOT NULL,
   email TEXT UNIQUE NOT NULL,
   password TEXT NOT NULL,   
   child_id INT REFERENCES students(id_assigned),
   personal_info TEXT`
);

// Courses table
createTable(
  "courses",
  `id SERIAL PRIMARY KEY,
   title TEXT UNIQUE NOT NULL,
   description TEXT,
   instructor INT REFERENCES teachers(id_assigned)`
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

// Reviews table
createTable(
  "doctor_feedbacks",
  `id SERIAL PRIMARY KEY,
    feedback TEXT,
   user_id INT REFERENCES doctors(id)`
);

createTable(
  "teacher_feedbacks",
  `id SERIAL PRIMARY KEY,
    feedback TEXT,
   user_id INT REFERENCES teachers(id)`
);

createTable(
  "parent_feedbacks",
  `id SERIAL PRIMARY KEY,
    feedback TEXT,
   user_id INT REFERENCES parents(id)`
);

createTable(
  "prescriptions",
  `id SERIAL PRIMARY KEY,
   prescription TEXT,
   patient_id INT REFERENCES students(id_assigned),
   doctor_id INT REFERENCES doctors(id_assigned)`
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

createTable(
  "quizzes",
  `id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  instructor INT REFERENCES teachers(id_assigned)`
);

createTable(
  "quiz_questions",
  `id SERIAL PRIMARY KEY,
  quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  option_1 TEXT NOT NULL,
  option_2 TEXT NOT NULL,
  option_3 TEXT NOT NULL,
  option_4 TEXT NOT NULL,
  answer TEXT NOT NULL`
);

createTable(
  "quiz_scores",
  `quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
  student_id INT REFERENCES students(id_assigned),
  teacher_id INT REFERENCES teachers(id_assigned),
  scores TEXT`
)

createTable(
  "lectures",
  `id SERIAL PRIMARY KEY,
   lecture_link TEXT,
   course_id INT REFERENCES courses(id),
   instructor INT REFERENCES teachers(id_assigned)`
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

export default pool;
