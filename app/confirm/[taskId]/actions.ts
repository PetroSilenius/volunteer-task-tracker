"use server";

import { getTaskById } from "@/lib/db";
import { getUserName } from "@/lib/user";
import { currentUser } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { drive, auth as gauth } from "@googleapis/drive";
import stream from "stream";
import lang from "@/dictionaries/lang.json";

export default async function confirmTaskDone(prevState: any, formData: FormData) {
  const taskId = Number(formData.get("task_id"))

  const { rows } = await getTaskById(taskId);
  const task = rows[0];

  const user = await currentUser();
  if (!user || user.id !== task.user_id) {
    throw new Error("You must be signed in to complete a task.");
  }
  const userName = getUserName(user);

  const googleAuth = new gauth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ""),
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  const driveInstance = drive({
    version: "v3",
    auth: googleAuth,
  });

  const file = formData.get("file") as File;
  const completedDate = formData.get("completed_date") as string;

  driveInstance.files.create({
    requestBody: {
      name: `${userName} - ${new Date(completedDate).toLocaleDateString(
        lang.localeDateFormat
      )}`,
      parents: [process.env.DRIVE_FOLDER_ID ?? ""],
      mimeType: file.type,
    },
    media: {
      mimeType: file.type,
      body: stream.Readable.from(Buffer.from(await file.arrayBuffer())),
    },
  });

  const revenueInCents = Number(formData.get("revenue")) * 100;

  await sql`
    UPDATE tasks
    SET completed_date = ${completedDate},
        revenue = ${revenueInCents},
        amount = ${Number(formData.get("amount"))}
    WHERE id = ${taskId} AND user_id = ${user.id}
  `;

  return redirect("/");
}