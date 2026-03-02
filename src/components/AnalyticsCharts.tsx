"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ChartData {
    name: string;
    completion: number;
    count: number;
}

export default function AnalyticsCharts({ data }: { data: ChartData[] }) {
    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" className="dark:stroke-zinc-800" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={12}
                        className="text-xs text-zinc-500 fill-zinc-500 dark:fill-zinc-400"
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `${value}%`}
                        className="text-xs font-medium text-zinc-500 fill-zinc-500 dark:fill-zinc-400"
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)" }}
                        formatter={(value: any) => [`${value}% Completion`, "Score"]}
                    />
                    <Line
                        type="monotone"
                        dataKey="completion"
                        stroke="hsl(var(--primary))"
                        strokeWidth={4}
                        dot={{ strokeWidth: 3, r: 5, stroke: "hsl(var(--primary))", fill: "#fff" }}
                        activeDot={{ r: 8, fill: "hsl(var(--primary))", stroke: "#fff" }}
                        className="transition-all duration-1000"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
