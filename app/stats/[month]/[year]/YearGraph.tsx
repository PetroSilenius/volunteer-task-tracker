"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/currency";
import lang from "@/dictionaries/lang.json";

const formatter = new Intl.DateTimeFormat(lang.localeDateFormat, {
  month: "short",
});

function calculateMonthlyRevenue(yearData: Task[]) {
  const monthlyRevenue = [];
  const monthTotals: { [key: string]: number } = {};

  for (let month = 0; month < 12; month++) {
    const date = new Date(new Date().getFullYear(), month, 1);
    const shortMonthName = formatter.format(date);
    monthTotals[shortMonthName] = 0;
  }

  for (const task of yearData) {
    const monthName = formatter.format(new Date(task.completed_date));

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
