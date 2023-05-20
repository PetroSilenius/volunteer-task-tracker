import { sql } from '@vercel/postgres'

// This is a helper function that will be used to seed the database.

export async function seed() {
  console.log('Seeding database... 🌱');

  const createTable = await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      planned_date DATE,
      completed_date DATE,
      file_url varchar(255),
      revenue INT,
      amount INT
    );
    `

    const tasks = Promise.all([
      sql`INSERT INTO tasks (user_id, planned_date) VALUES ('user_2Q3KT3jtjhEf4Ne5yFLXgzOOAYY', '2023-01-01')`,
      sql`INSERT INTO tasks (user_id, planned_date) VALUES ('user_2Q3KT3jtjhEf4Ne5yFLXgzOOAYY', '2023-02-01')`,
      sql`INSERT INTO tasks (user_id, planned_date) VALUES ('user_2Q3KT3jtjhEf4Ne5yFLXgzOOAYY', '2023-03-01')`,
      sql`INSERT INTO tasks (user_id, planned_date) VALUES ('user_2Q3KT3jtjhEf4Ne5yFLXgzOOAYY', '2023-04-01')`,
      sql`INSERT INTO tasks (user_id, planned_date) VALUES ('user_2Q3KT3jtjhEf4Ne5yFLXgzOOAYY', '2023-05-01')`,
    ]);

    return {
      createTable,
      tasks
    }
};