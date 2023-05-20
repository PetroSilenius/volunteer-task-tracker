import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTaskById } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";

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

    await sql`
      UPDATE tasks
      SET completed_date = ${formData.get("completed_date") as string},
          revenue = ${Number(formData.get("revenue"))},
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
        <Input name="revenue" type="number" />
        <Label htmlFor="amount">Amount</Label>
        <Input name="amount" type="number" />
        <Button type="submit">Submit</Button>
      </form>
    </main>
  );
}
