import { useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import PageHeader from "@/components/PageHeader";

const monthly = [
  { m: "Jan", jobs: 220 },
  { m: "Feb", jobs: 280 },
  { m: "Mar", jobs: 310 },
  { m: "Apr", jobs: 360 },
  { m: "May", jobs: 410 },
  { m: "Jun", jobs: 470 },
  { m: "Jul", jobs: 520 },
  { m: "Aug", jobs: 590 },
  { m: "Sep", jobs: 640 },
];

const snr = [
  { d: "W1", v: 12 },
  { d: "W2", v: 14 },
  { d: "W3", v: 15 },
  { d: "W4", v: 17 },
  { d: "W5", v: 16 },
  { d: "W6", v: 18 },
  { d: "W7", v: 19 },
  { d: "W8", v: 21 },
];

const mix = [
  { name: "Speech Opt.", value: 38, color: "#2dd4bf" },
  { name: "Audio Enh.", value: 28, color: "#575fb9" },
  { name: "Noise Red.", value: 22, color: "#6f4bd6" },
  { name: "Intelligent", value: 12, color: "#4f63ff" },
];

const top = [
  {
    name: "podcast_master_44.wav",
    gain: "+22.4 dB",
    tool: "Speech Opt.",
  },
  {
    name: "field_record_north.flac",
    gain: "+19.8 dB",
    tool: "Noise Red.",
  },
  {
    name: "interview_dec_07.mp3",
    gain: "+18.1 dB",
    tool: "Speech Opt.",
  },
  {
    name: "studio_session_07.wav",
    gain: "+15.6 dB",
    tool: "Audio Enh.",
  },
];

export default function Analytics() {
  // ✅ ADDED: scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Insights"
        title="Analytics Dashboard"
        description="Track processing volume, quality gains and tool mix across your workspace."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Total Jobs", v: "12,548" },
          { l: "Avg. SNR Gain", v: "+17.8 dB" },
          { l: "Total Hours", v: "1,284h" },
          { l: "Active Projects", v: "32" },
        ].map((s) => (
          <div key={s.l} className="glass-strong rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {s.l}
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold mt-1">
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 glass-strong rounded-2xl p-6">
          <div className="font-display font-semibold mb-4">
            Monthly processing volume
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="m"
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(19,20,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "white",
                  }}
                />
                <Bar
                  dataKey="jobs"
                  fill="#575fb9"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="font-display font-semibold mb-4">
            Tool mix
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mix}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {mix.map((m, i) => (
                    <Cell key={i} fill={m.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "rgba(19,20,42,0.95)",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "white",
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 glass-strong rounded-2xl p-6">
          <div className="font-display font-semibold mb-4">
            Avg. SNR gain over time
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={snr}>
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="d"
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(19,20,42,0.95)",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#2dd4bf"
                  strokeWidth={3}
                  dot={{ fill: "#2dd4bf", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top improvements */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="font-display font-semibold mb-4">
            Top improvements
          </div>

          <ul className="space-y-3">
            {top.map((t) => (
              <li
                key={t.name}
                className="glass rounded-xl p-3"
              >
                <div className="text-sm font-medium truncate">
                  {t.name}
                </div>

                <div className="flex justify-between mt-1 text-[11px]">
                  <span className="text-muted-foreground">
                    {t.tool}
                  </span>
                  <span className="text-emerald-400 font-medium">
                    {t.gain}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}