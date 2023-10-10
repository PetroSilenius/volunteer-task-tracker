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
import { getUserName, getAllUsers } from "@/lib/user";
import { auth } from "@clerk/nextjs";
import lang from "@/dictionaries/lang.json";

export const revalidate = 0;

export default async function Home() {
  const { rows: tasks } = await getPlannedTasksForYear(new Date());
  const users = await getAllUsers();

  const { userId } = auth();

  return (
    <main>
      <Table>
        <TableCaption>{lang.taskList.caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>{lang.taskList.plannedDate}</TableHead>
            <TableHead>{lang.taskList.assignee}</TableHead>
            <TableHead className="text-right">{lang.taskList.status}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task: Task) => {
            const ownUncompletedTask = userId === task.user_id && !task.completed_date;

            return (
              <TableRow
                key={task.id}
                data-state={ownUncompletedTask ? "selected" : ""}
              >
                <TableCell>
                  {task.planned_date.toLocaleDateString(lang.localeDateFormat)}
                </TableCell>
                <TableCell>
                  {getUserName(users.find((u) => u.id === task.user_id))}
                </TableCell>
                <TableCell className="text-right text-xl">
                  {task.completed_date ? (
                    "✅"
                  ) : task.planned_date > new Date() ? (
                    "🕑"
                  ) : (
                    <Link href={`/confirm/${task.id}`}>📝</Link>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </main>
  );
}
