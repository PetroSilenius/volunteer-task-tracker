import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function compareMetrics(currentMetric: number, lastMetric: number) {
  const metricDifference = currentMetric - lastMetric;

  if (metricDifference === 0 || lastMetric === 0) {
    return;
  }

  const percentageDifference = ((metricDifference / lastMetric) * 100).toFixed(
    2
  );

  const sign = metricDifference > 0 ? "+" : "";

  return `${sign}${percentageDifference}%`;
}

export function StatCard({
  title,
  icon,
  stat,
  previousStat,
}: {
  title: string;
  icon: React.ReactNode;
  stat: number;
  previousStat: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat}</div>
        <p className="text-xs text-muted-foreground">
          {compareMetrics(stat, previousStat)}
        </p>
      </CardContent>
    </Card>
  );
}
