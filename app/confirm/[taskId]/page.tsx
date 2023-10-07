import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTaskById } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { drive, auth as gauth } from "@googleapis/drive";
import stream from "stream";

export default async function Confirm({
  params: { taskId },
}: {
  params: { taskId: string };
}) {
  async function confirmTaskDone(formData: FormData) {
    "use server";

    const { userId, user } = auth();
    if (!userId) {
      throw new Error("You must be signed in to complete a task.");
    }

    const googleAuth = new gauth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ""),
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const driveInstance = drive({
      version: "v3",
      auth: googleAuth,
    });

    const file = formData.get("file") as File;

    await driveInstance.files.create({
      requestBody: {
        name: `${user?.firstName} - ${task.planned_date.toLocaleDateString(
          "fi-fi"
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
      SET completed_date = ${formData.get("completed_date") as string},
          revenue = ${revenueInCents},
          amount = ${Number(formData.get("amount"))}
      WHERE id = ${taskId} AND user_id = ${userId}
    `;
    redirect("/");
  }

  const { rows } = await getTaskById(Number(taskId));
  const task = rows[0];

  return (
    <main>
      <p>Planned date: {task.planned_date.toLocaleDateString("fi-fi")}</p>
      <form action={confirmTaskDone}>
        <Label htmlFor="file">Upload receipt</Label>
        <Input name="file" type="file" />
        <Label htmlFor="completed_date">Completion date</Label>
        <Input name="completed_date" type="date" />
        <Label htmlFor="revenue">Revenue</Label>
        <Input name="revenue" pattern="^\d+(?:[.,]\d{1,2})?\s*€?$" />
        <Label htmlFor="amount">Amount</Label>
        <Input name="amount" type="number" />
        <Button type="submit">Submit</Button>
      </form>
    </main>
  );
}
