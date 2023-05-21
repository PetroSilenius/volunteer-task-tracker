import { sql } from "@vercel/postgres";

export const getCompletedTasksForMonth = async (month: Date) => 
    await sql<Task>`SELECT * FROM tasks WHERE EXTRACT(YEAR FROM completed_date) = ${month.getFullYear()} AND EXTRACT(MONTH FROM completed_date) = ${month.getMonth() + 1}`;

export const getCompletedTasksForYear = async(year: Date) => await sql<Task>`SELECT * FROM tasks WHERE EXTRACT(YEAR FROM completed_date) = ${year.getFullYear()}`;

export const getPlannedTasksForYear = async(year: Date) => await sql<Task>`SELECT * FROM tasks WHERE EXTRACT(YEAR FROM planned_date) = ${year.getFullYear()} OR completed_date IS NULL ORDER BY planned_date`;

export const getTaskById = async(id: number) => await sql<Task>`SELECT * FROM tasks WHERE id = ${id}`;

export const getTasksForTomorrow = async() => await sql<Task>`SELECT * FROM tasks WHERE planned_date = CURRENT_DATE + INTERVAL '1 day'`;