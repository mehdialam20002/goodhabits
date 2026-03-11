"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useState } from "react";

interface ChartData {
  name: string;
  completion: number;
  count: number;
}

interface HabitBreakdown {
  title: string;
  rate: number;
  completions: number;
}

type ChartType = "line" | "bar" | "area";

const PIE_COLORS = ["#7c3aed", "#06b6d4", "#f59e0b", "#10b981", "#ec4899"];

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

export default function AnalyticsCharts({
  data,
  habitBreakdown,
  averageCompletion,
}: {
  data: ChartData[];
  habitBreakdown: HabitBreakdown[];
  averageCompletion: number;
}) {
  const [chartType, setChartType] = useState<ChartType>("line");

  useEffect(() => {
    const stored = window.localStorage.getItem("aura-chart-type");
    if (stored === "line" || stored === "bar" || stored === "area") setChartType(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("aura-chart-type", chartType);
  }, [chartType]);

  const pieData = useMemo(
    () =>
      habitBreakdown.slice(0, 5).map((habit) => ({
        name: habit.title,
        value: Math.max(habit.completions, 1),
      })),
    [habitBreakdown],
  );

  const radialData = [
    {
      name: "Average",
      value: averageCompletion,
      fill: "#7c3aed",
    },
  ];

  return (
    <div className="mt-4 space-y-6">
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

      <div className="h-[280px] w-full md:h-[340px]">
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Habit share</p>
            <h4 className="mt-2 text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">Completion distribution</h4>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={84} paddingAngle={4}>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Intensity</p>
            <h4 className="mt-2 text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">Average completion gauge</h4>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="45%" outerRadius="80%" barSize={18} data={radialData} startAngle={180} endAngle={0}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={20} />
                <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="fill-zinc-900 dark:fill-zinc-100" style={{ fontSize: 34, fontWeight: 900 }}>
                  {averageCompletion}%
                </text>
                <text x="50%" y="61%" textAnchor="middle" dominantBaseline="middle" className="fill-zinc-500 dark:fill-zinc-400" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>
                  AVERAGE
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
