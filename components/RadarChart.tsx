"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Maths", A: 20 },
  { subject: "Physique", A: 65 },
  { subject: "Français", A: 75 },
  { subject: "Anglais", A: 70 },
  { subject: "Histoire", A: 60 },
  { subject: "Philo", A: 72 },
];

export default function SkillsRadar() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />

        {/* Radar bleu */}
        <Radar
          dataKey="A"
          stroke="#1E3A8A"      // contour bleu foncé
          fill="#3B82F6"        // remplissage bleu clair
          fillOpacity={0.6}     // transparence
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
