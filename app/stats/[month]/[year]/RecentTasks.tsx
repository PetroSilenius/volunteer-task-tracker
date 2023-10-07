import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCompletedTasksForMonth } from "@/lib/db";
import { getUserName } from "@/lib/user";
import { formatCurrency } from "@/lib/currency";

export async function RecentTasks({ month }: { month: Date }) {
  const { rows: recentTasks } = await getCompletedTasksForMonth(month);

  return (
    <div className="space-y-8">
      {recentTasks.slice(-5).map((task) => (
        <div className="flex items-center" key={task.id}>
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{getUserName(task.user_id, true)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {getUserName(task.user_id)}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {formatCurrency(task.revenue)}
          </div>
          <div className="ml-auto font-medium">
            {task.completed_date?.toLocaleDateString("fi-fi")}
          </div>
        </div>
      ))}
    </div>
  );
}
