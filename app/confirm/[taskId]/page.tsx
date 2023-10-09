import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getTaskById } from "@/lib/db";
import { getUserName } from "@/lib/user";
import { currentUser } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { drive, auth as gauth } from "@googleapis/drive";
import stream from "stream";
import { revalidatePath } from "next/cache";
import lang from "@/dictionaries/lang.json";

export default async function Confirm({
  params: { taskId },
}: {
  params: { taskId: string };
}) {
  async function confirmTaskDone(formData: FormData) {
    "use server";

    const user = await currentUser();
    if (!user) {
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

    await driveInstance.files.create({
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
    revalidatePath("/");
    redirect("/");
  }

  const { rows } = await getTaskById(Number(taskId));
  const task = rows[0];

  return (
    <main className="px-4 pt-2">
      <p>
        {lang.confirm.plannedDate}:{" "}
        {task.planned_date.toLocaleDateString(lang.localeDateFormat)}
      </p>
      <form action={confirmTaskDone} className="flex flex-col gap-4 my-8">
        <Label htmlFor="file">{lang.confirm.uploadFile}</Label>
        <Input name="file" id="file" type="file" required={true} />
        <Label htmlFor="completed_date">{lang.confirm.completedDate}</Label>
        <Input
          name="completed_date"
          id="completed_date"
          type="date"
          required={true}
          defaultValue={new Date().toLocaleDateString("en-CA")}
        />
        <Label htmlFor="revenue">{lang.confirm.revenue}</Label>
        <Input
          name="revenue"
          id="revenue"
          pattern="^\d+(?:[.,]\d{1,2})?\s*€?$"
          required={true}
        />
        <Label htmlFor="amount">{lang.confirm.amount}</Label>
        <Input name="amount" id="amount" type="number" required={true} />

        <div className="flex gap-2">
          <Checkbox id="equipment" required={true} />
          <div className="flex flex-col">
            <Label htmlFor="equipment">{lang.confirm.returnedEquipment}</Label>
            <p className="text-sm text-muted-foreground">
              {lang.confirm.returnedEquipmentDescription}
            </p>
          </div>
        </div>

        <Button type="submit" className="px-8 mx-auto">
          {lang.confirm.submit}
        </Button>
      </form>
    </main>
  );
}
