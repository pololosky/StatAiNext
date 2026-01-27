"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  defs,
} from "recharts";

const data = [
  { month: "Sept", value: 14 },
  { month: "Oct", value: 15 },
  { month: "Nov", value: 13 },
  { month: "Dec", value: 14 },
  { month: "Jan", value: 15 },
];

export default function AverageBarChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        {/* Définition du gradient */}
        <defs>
          <linearGradient id="bleuGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" stopOpacity={1} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={1} />
          </linearGradient>
        </defs>

        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="value"
          fill="url(#bleuGradient)"  // Utilise l'id défini ci-dessus
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
