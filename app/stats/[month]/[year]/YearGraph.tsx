"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/currency";

function calculateMonthlyRevenue(yearData: Task[]) {
  const monthlyRevenue = [];

  const monthTotals: { [key: string]: number } = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  for (const task of yearData) {
    const monthName = new Date(task.completed_date).toLocaleString("en-US", {
      month: "short",
    });

    monthTotals[monthName] += task.revenue;
  }

  for (const [monthName, total] of Object.entries(monthTotals)) {
    monthlyRevenue.push({ name: monthName, total });
  }

  return monthlyRevenue;
}

export function YearGraph({ yearData }: { yearData: Task[] }) {
  const data = calculateMonthlyRevenue(yearData);
  return (
    <ResponsiveContainer width="95%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
