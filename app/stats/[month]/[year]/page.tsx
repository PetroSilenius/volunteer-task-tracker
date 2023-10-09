import {
  DollarSign,
  Users,
  CreditCard,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecentTasks } from "./RecentTasks";
import { YearGraph } from "./YearGraph";
import Link from "next/link";
import { getCompletedTasksForMonth, getCompletedTasksForYear } from "@/lib/db";
import { StatCard } from "./StatCard";
import lang from "@/dictionaries/lang.json";

function calculateTaskStats(tasks: Task[]) {
  const stats = {
    revenue: 0,
    amount: 0,
    uniqueActiveUsers: 0,
  };

  const uniqueUsers = new Set<string>();

  for (const task of tasks) {
    stats.revenue += task.revenue;
    stats.amount += task.amount;
    uniqueUsers.add(task.user_id);
  }

  stats.uniqueActiveUsers = uniqueUsers.size;
  return stats;
}

function getMonthDates(month: number, year: number) {
  const currentMonthDate = new Date(year, month - 1, 8);
  const nextMonthDate = new Date(year, month, 8);
  const previousMonthDate = new Date(year, month - 2, 8);

  return {
    currentMonth: currentMonthDate,
    nextMonth: nextMonthDate,
    previousMonth: previousMonthDate,
  };
}

export default async function Stats({
  params: { month, year },
}: {
  params: { month: string; year: string };
}) {
  const { currentMonth, nextMonth, previousMonth } = getMonthDates(
    Number(month),
    Number(year)
  );

  const currentMonthData = await getCompletedTasksForMonth(currentMonth);

  const lastMonthData = await getCompletedTasksForMonth(previousMonth);

  const currentMonthStats = calculateTaskStats(currentMonthData.rows);
  const lastMonthStats = calculateTaskStats(lastMonthData.rows);

  const { rows: yearData } = await getCompletedTasksForYear(currentMonth);

  return (
    <div className="flex-col flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{lang.stats.dashboard}</h2>
          <div className="flex items-center gap-2">
            <Link
              href={`/stats/${
                previousMonth.getMonth() + 1
              }/${previousMonth.getFullYear()}`}
            >
              <Button>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            {currentMonth.toLocaleString("default", {
              month: "short",
              year: "2-digit",
            })}
            <Link
              href={`/stats/${
                nextMonth.getMonth() + 1
              }/${nextMonth.getFullYear()}`}
            >
              <Button>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={lang.stats.totalRevenue}
            icon={<DollarSign className="h-4 w-4" />}
            stat={currentMonthStats.revenue}
            previousStat={lastMonthStats.revenue}
            isCurrency={true}
          />
          <StatCard
            title={lang.stats.totalAmount}
            icon={<CreditCard className="h-4 w-4" />}
            stat={currentMonthStats.amount}
            previousStat={lastMonthStats.amount}
          />

          <StatCard
            title={lang.stats.totalTasks}
            icon={<Activity className="h-4 w-4" />}
            stat={currentMonthData.rowCount}
            previousStat={lastMonthData.rowCount}
          />

          <StatCard
            title={lang.stats.uniqueAssignees}
            icon={<Users className="h-4 w-4" />}
            stat={currentMonthStats.uniqueActiveUsers}
            previousStat={lastMonthStats.uniqueActiveUsers}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-5 lg:grid-cols-7">
          <Card className="md:col-span-3 lg:col-span-4">
            <CardHeader>
              <CardTitle>{lang.stats.overview}</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <YearGraph yearData={yearData} />
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>{lang.stats.recentCompletions}</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentTasks month={currentMonth} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
