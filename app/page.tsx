import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { getPlannedTasksForYear } from "@/lib/db";
import { getUserName } from "@/lib/user";

export default async function Home() {
  const { rows: tasks } = await getPlannedTasksForYear(new Date());

  return (
    <main>
      <Table>
        <TableCaption>A list of tasks for volunteers</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Planned date</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task: Task) => (
            <TableRow key={task.id}>
              <TableCell>
                {task.planned_date.toLocaleDateString("fi-fi")}
              </TableCell>
              <TableCell>{getUserName(task.user_id)}</TableCell>
              <TableCell className="text-right">
                {task.completed_date ? (
                  "✅"
                ) : task.planned_date > new Date() ? (
                  "🕑"
                ) : (
                  <Link href={`/confirm/${task.id}`}>📝</Link>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
