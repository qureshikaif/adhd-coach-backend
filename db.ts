import { Pool } from "pg";
import "dotenv/config";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

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

const createCourse = async (title: string, compulsory: any) => {
  const result = await pool.query(
    `
      SELECT id FROM courses WHERE title = $1
    `,
    [title]
  );
  let courseId = result.rows[0]?.id;
  if (!courseId) {
    const insertResult = await pool.query(
      "INSERT INTO courses (title, compulsory) VALUES ($1, $2) RETURNING id",
      [title, compulsory]
    );
    courseId = insertResult.rows[0].id;
  }
  return courseId;
};

const createLecture = async (courseId: string, lectureLink: string) => {
  const existingLecture = await pool.query(
    "SELECT id FROM lectures WHERE course_id = $1 AND lecture_link = $2",
    [courseId, lectureLink]
  );

  if (existingLecture.rowCount === 0) {
    await pool.query(
      "INSERT INTO lectures (lecture_link, course_id) VALUES ($1, $2)",
      [lectureLink, courseId]
    );
  } else {
    console.log("Lecture already exists.");
  }
};

const addQuizzes = async () => {
  try {
    const courses = [
      { title: "English", quizTitle: "English Quiz" },
      { title: "Maths", quizTitle: "Maths Quiz" },
    ];

    for (const course of courses) {
      const courseResult = await pool.query(
        "SELECT id FROM courses WHERE title = $1",
        [course.title]
      );

      const courseId = courseResult.rows[0]?.id;

      if (courseId) {
        const existingQuizResult = await pool.query(
          "SELECT id FROM quizzes WHERE course_id = $1 AND title = $2",
          [courseId, course.quizTitle]
        );

        if (existingQuizResult.rowCount === 0) {
          const quizInsertResult = await pool.query(
            "INSERT INTO quizzes (course_id, title) VALUES ($1, $2) RETURNING id",
            [courseId, course.quizTitle]
          );

          const quizId = quizInsertResult.rows[0]?.id;

          if (quizId) {
            // Define the type of quizQuestions array
            let quizQuestions: {
              question: string;
              option1: string;
              option2: string;
              option3: string;
              option4: string;
              answer: string;
            }[] = [];
            if (course.title === "English") {
              quizQuestions = [
                {
                  question: "What is the capital of England?",
                  option1: "London",
                  option2: "Manchester",
                  option3: "Liverpool",
                  option4: "Birmingham",
                  answer: "London",
                },
                {
                  question: 'Who wrote "Romeo and Juliet"?',
                  option1: "William Shakespeare",
                  option2: "Charles Dickens",
                  option3: "Jane Austen",
                  option4: "Mark Twain",
                  answer: "William Shakespeare",
                },
                // Add more English questions here
              ];
            } else if (course.title === "Maths") {
              quizQuestions = [
                {
                  question: "What is the result of 5 * 6?",
                  option1: "25",
                  option2: "30",
                  option3: "35",
                  option4: "40",
                  answer: "30",
                },
                {
                  question: "What is the square root of 64?",
                  option1: "4",
                  option2: "6",
                  option3: "8",
                  option4: "10",
                  answer: "8",
                },
                // Add more Maths questions here
              ];
            }

            const questionPromises = quizQuestions.map((q) =>
              pool.query(
                "INSERT INTO quiz_questions (quiz_id, question, option_1, option_2, option_3, option_4, answer) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                [
                  quizId,
                  q.question,
                  q.option1,
                  q.option2,
                  q.option3,
                  q.option4,
                  q.answer,
                ]
              )
            );

            await Promise.all(questionPromises);
          }
        } else {
          console.log(
            `${course.quizTitle} for ${course.title} already exists.`
          );
        }
      }
    }

    console.log("Quizzes added successfully.");
  } catch (error) {
    console.error("Error adding quizzes:", error);
  }
};

// Courses table
createTable(
  "courses",
  `id SERIAL PRIMARY KEY,
   title TEXT UNIQUE NOT NULL,
   instructor INT REFERENCES teachers(id_assigned) DEFAULT NULL,
   compulsory BOOLEAN DEFAULT FALSE`
);

// Lectures table
createTable(
  "lectures",
  `id SERIAL PRIMARY KEY,
   lecture_link TEXT,
   course_id INT REFERENCES courses(id),
   instructor INT REFERENCES teachers(id_assigned) DEFAULT NULL`
);

// Admin table
createTable(
  "admins",
  `id SERIAL PRIMARY KEY,
   full_name TEXT NOT NULL,
   email TEXT UNIQUE NOT NULL,
   password TEXT NOT NULL`
);

// Parent table
createTable(
  "parents",
  `id SERIAL PRIMARY KEY,
   image TEXT,
   full_name TEXT NOT NULL,
   email TEXT UNIQUE NOT NULL,
   password TEXT NOT NULL,   
   child_id INT REFERENCES students(id_assigned)`
);

// Teacher table
createTable(
  "teachers",
  `id SERIAL PRIMARY KEY,
   id_assigned INT UNIQUE NOT NULL,
   image TEXT,
   full_name TEXT,
   email TEXT UNIQUE,
   password TEXT`
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
   specialization TEXT`
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
   compulsory_courses_completed BOOLEAN DEFAULT FALSE`
);

// Student Courses table
createTable(
  "student_courses",
  `student_id INT REFERENCES students(id_assigned) ON DELETE CASCADE,
   course_id INT REFERENCES courses(id) ON DELETE CASCADE,
   PRIMARY KEY (student_id, course_id),
   enrolled_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
);

// Quizzes table
createTable(
  "quizzes",
  `id SERIAL PRIMARY KEY,
   title TEXT NOT NULL,
   instructor INT REFERENCES teachers(id_assigned) ON DELETE CASCADE DEFAULT NULL,
   course_id INT REFERENCES courses(id) ON DELETE CASCADE`
);

// Quiz Questions table
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

// Quiz Scores table
createTable(
  "quiz_scores",
  `quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
   student_id INT REFERENCES students(id_assigned) ON DELETE CASCADE,
   teacher_id INT REFERENCES teachers(id_assigned) ON DELETE CASCADE,
   scores TEXT,
   PRIMARY KEY (quiz_id, student_id)`
);

// Progress Reports table
createTable(
  "progress_reports",
  `id SERIAL PRIMARY KEY,
   student_id INT REFERENCES students(id_assigned) ON DELETE CASCADE,
   course_id INT REFERENCES courses(id) ON DELETE CASCADE,
   teacher_id INT REFERENCES teachers(id_assigned) ON DELETE CASCADE,
   score INT,
   remarks TEXT,
   date TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
);

// Doctor Feedbacks table
createTable(
  "doctor_feedbacks",
  `id SERIAL PRIMARY KEY,
   feedback TEXT,
   user_id INT REFERENCES doctors(id)`
);

// Teacher Feedbacks table
createTable(
  "teacher_feedbacks",
  `id SERIAL PRIMARY KEY,
   feedback TEXT,
   user_id INT REFERENCES teachers(id)`
);

// Parent Feedbacks table
createTable(
  "parent_feedbacks",
  `id SERIAL PRIMARY KEY,
   feedback TEXT,
   user_id INT REFERENCES parents(id)`
);

// Prescriptions table
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

// Assessments table
createTable(
  "assessments",
  `id SERIAL PRIMARY KEY,
   student_id INT REFERENCES students(id),
   score INT,
   date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   type TEXT`
);

// Remarks table
createTable(
  "doctor_remarks",
  `id SERIAL PRIMARY KEY,
   student_id INT REFERENCES students(id_assigned),
   doctor_id INT REFERENCES doctors(id_assigned),
   remark TEXT,
   date TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
);

// Chats table
createTable(
  "chats",
  `id SERIAL PRIMARY KEY,
   sender_id INT NOT NULL,
   receiver_id INT NOT NULL,
   message TEXT NOT NULL,
   timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
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

createTable(
  "doctor_assignments",
  `id SERIAL PRIMARY KEY,
   parent_id INT REFERENCES parents(id) ON DELETE CASCADE,
   student_id INT REFERENCES students(id_assigned) ON DELETE CASCADE,
   doctor_id INT REFERENCES doctors(id_assigned) ON DELETE CASCADE,
   assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   UNIQUE (student_id)`
);

createTable(
  "mood_entries",
  `id SERIAL PRIMARY KEY,
   student_id INT REFERENCES students(id_assigned) ON DELETE CASCADE,
   mood TEXT NOT NULL,
   date TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
);

(async () => {
  const englishCourseId = await createCourse("English", true);
  const mathsCourseId = await createCourse("Maths", true);

  await createLecture(englishCourseId, "http://example.com/english1");
  await createLecture(englishCourseId, "http://example.com/english2");

  await createLecture(mathsCourseId, "http://example.com/maths1");
  await createLecture(mathsCourseId, "http://example.com/maths2");

  await addQuizzes();
})();

export default pool;
