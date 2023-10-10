import { getTaskById } from "@/lib/db";
import lang from "@/dictionaries/lang.json";
import ConfirmForm from "./ConfirmForm";

export const revalidate = 0;

export default async function Confirm({
  params: { taskId },
}: {
  params: { taskId: string };
}) {
  const { rows } = await getTaskById(Number(taskId));
  const task = rows[0];

  return (
    <main className="px-4 pt-2">
      <p>
        {lang.confirm.plannedDate}:{" "}
        {task.planned_date.toLocaleDateString(lang.localeDateFormat)}
      </p>
      <ConfirmForm taskId={task.id} />
    </main>
  );
}
