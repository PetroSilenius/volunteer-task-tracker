import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCompletedTasksForMonth } from "@/lib/db";
import { getUserName, getAllUsers } from "@/lib/user";
import { formatCurrency } from "@/lib/currency";

export async function RecentTasks({ month }: { month: Date }) {
  const { rows: recentTasks } = await getCompletedTasksForMonth(month);
  const users = await getAllUsers();

  return (
    <div className="space-y-8">
      {recentTasks.slice(-5).map((task) => {
        const user = users.find((u) => u.id === task.user_id);
        return (
          <div className="flex items-center gap-2 font-medium" key={task.id}>
            <Avatar className="h-9 w-9 md:hidden lg:flex">
              <AvatarImage src={user?.imageUrl} alt="Avatar" />
              <AvatarFallback>{getUserName(user, true)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm leading-none">{getUserName(user)}</p>
            </div>
            <div>{formatCurrency(task.revenue)}</div>
            <div>{task.completed_date?.toLocaleDateString("fi-fi")}</div>
          </div>
        );
      })}
    </div>
  );
}
