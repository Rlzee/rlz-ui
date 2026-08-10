import { Chart, Recharts } from "@rlz/ui/components/ui/chart";
import type { ChartConfig } from "@rlz/ui/components/ui/chart";

const config: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
};

const data = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 5000, expenses: 3200 },
];

export default function Example() {
  return (
    <Chart config={config} className="h-64">
      <Recharts.BarChart data={data}>
        <Recharts.CartesianGrid vertical={false} />
        <Recharts.XAxis dataKey="month" />
        <Chart.Tooltip content={<Chart.TooltipContent />} />
        <Chart.Legend content={<Chart.LegendContent />} />
        <Recharts.Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          radius={4}
        />
        <Recharts.Bar
          dataKey="expenses"
          fill="var(--color-expenses)"
          radius={4}
        />
      </Recharts.BarChart>
    </Chart>
  );
}
