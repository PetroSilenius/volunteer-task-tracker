import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTaskById } from "@/lib/db";
import { getUserName } from "@/lib/user";
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

    const { userId } = auth();
    if (!userId) {
      throw new Error("You must be signed in to complete a task.");
    }
    const userName = await getUserName(userId);

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

    await driveInstance.files.create({
      requestBody: {
        name: `${userName} - ${new Date(completedDate).toLocaleDateString(
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
      SET completed_date = ${completedDate},
          revenue = ${revenueInCents},
          amount = ${Number(formData.get("amount"))}
      WHERE id = ${taskId} AND user_id = ${userId}
    `;
    redirect("/");
  }

  const { rows } = await getTaskById(Number(taskId));
  const task = rows[0];

  return (
    <main className="px-4 pt-2">
      <p>Planned date: {task.planned_date.toLocaleDateString("fi-fi")}</p>
      <form action={confirmTaskDone} className="flex flex-col gap-4 my-8">
        <Label htmlFor="file">Upload receipt</Label>
        <Input name="file" type="file" required={true} />
        <Label htmlFor="completed_date">Completion date</Label>
        <Input
          name="completed_date"
          type="date"
          required={true}
          defaultValue={new Date().toLocaleDateString("en-CA")}
        />
        <Label htmlFor="revenue">Revenue</Label>
        <Input
          name="revenue"
          pattern="^\d+(?:[.,]\d{1,2})?\s*€?$"
          required={true}
        />
        <Label htmlFor="amount">Amount</Label>
        <Input name="amount" type="number" required={true} />
        <Button type="submit" className="px-8 mx-auto">
          Submit
        </Button>
      </form>
    </main>
  );
}
