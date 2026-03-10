"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

interface ChartData {
  name: string;
  completion: number;
  count: number;
}

type ChartType = "line" | "bar" | "area";

function SharedAxes() {
  return (
    <>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" className="dark:stroke-zinc-800" />
      <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={12} className="fill-zinc-500 text-xs dark:fill-zinc-400" />
      <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} className="fill-zinc-500 text-xs font-medium dark:fill-zinc-400" />
      <Tooltip
        contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)" }}
        formatter={(value: any, name: string | undefined, item: any) =>
          name === "completion"
            ? [`${value}% Completion`, "Score"]
            : [`${item?.payload?.count ?? value} habits completed`, "Count"]
        }
        labelFormatter={(label) => `Period: ${label}`}
      />
    </>
  );
}

export default function AnalyticsCharts({ data }: { data: ChartData[] }) {
  const [chartType, setChartType] = useState<ChartType>("line");

  useEffect(() => {
    const stored = window.localStorage.getItem("aura-chart-type");
    if (stored === "line" || stored === "bar" || stored === "area") setChartType(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("aura-chart-type", chartType);
  }, [chartType]);

  return (
    <div className="mt-4">
      <div className="mb-4 flex flex-wrap gap-2">
        {(["line", "bar", "area"] as ChartType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setChartType(type)}
            className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] ${
              chartType === type
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "border border-zinc-200 text-zinc-500 dark:border-zinc-800"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="h-[280px] w-full md:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={data}>
              <SharedAxes />
              <Bar dataKey="completion" fill="hsl(var(--primary))" radius={[16, 16, 4, 4]} />
            </BarChart>
          ) : chartType === "area" ? (
            <AreaChart data={data}>
              <SharedAxes />
              <Area type="monotone" dataKey="completion" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.18} strokeWidth={3} />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <SharedAxes />
              <Line type="monotone" dataKey="completion" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ strokeWidth: 3, r: 5, stroke: "hsl(var(--primary))", fill: "#fff" }} activeDot={{ r: 8, fill: "hsl(var(--primary))", stroke: "#fff" }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
