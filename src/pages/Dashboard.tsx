import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AudioWaveform,
  Volume2,
  Brain,
  Mic,
  ArrowRight,
  Upload,
  Sparkles,
  Activity,
  Clock,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

import PageHeader from "@/components/PageHeader";
import Waveform from "@/components/Waveform";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Files processed",
    target: 1284,
    suffix: "",
    delta: "+12.4%",
    icon: Activity,
    prefix: "",
  },
  {
    label: "Avg. SNR gain",
    target: 17.2,
    suffix: " dB",
    delta: "+2.1 dB",
    icon: TrendingUp,
    prefix: "+",
    decimals: 1,
  },
  {
    label: "Hours saved",
    target: 342,
    suffix: "h",
    delta: "+8.0%",
    icon: Clock,
    prefix: "",
  },
  {
    label: "Quality score",
    target: 94,
    suffix: "/100",
    delta: "+3",
    icon: CheckCircle2,
    prefix: "",
  },
];

const tools = [
  {
    to: "/audio-enhancement",
    title: "Audio Enhancement",
    desc: "Bring clarity & depth to any recording.",
    icon: AudioWaveform,
    accent: "from-[#575fb9] to-[#272863]",
  },
  {
    to: "/noise-reduction",
    title: "Noise Reduction",
    desc: "Surgical removal of hiss, hum & wind.",
    icon: Volume2,
    accent: "from-[#6f4bd6] to-[#575fb9]",
  },
  {
    to: "/intelligent-processing",
    title: "Intelligent Processing",
    desc: "Adaptive AI chain — set it & forget it.",
    icon: Brain,
    accent: "from-[#4f63ff] to-[#6f4bd6]",
  },
  {
    to: "/speech-optimization",
    title: "Speech Optimization",
    desc: "Broadcast-ready voice in one click.",
    icon: Mic,
    accent: "from-[#2dd4bf] to-[#575fb9]",
  },
];

const chartData = [
  { d: "Mon", jobs: 32, gain: 14 },
  { d: "Tue", jobs: 48, gain: 16 },
  { d: "Wed", jobs: 41, gain: 15 },
  { d: "Thu", jobs: 67, gain: 18 },
  { d: "Fri", jobs: 88, gain: 19 },
  { d: "Sat", jobs: 54, gain: 17 },
  { d: "Sun", jobs: 73, gain: 20 },
];

const recent = [
  {
    name: "podcast_ep_42_master.wav",
    tool: "Speech Optimization",
    time: "2m ago",
    status: "Complete",
  },
  {
    name: "field_interview_03.mp3",
    tool: "Noise Reduction",
    time: "14m ago",
    status: "Complete",
  },
  {
    name: "live_set_segment_b.flac",
    tool: "Intelligent Processing",
    time: "1h ago",
    status: "Complete",
  },
  {
    name: "voice_memo_007.m4a",
    tool: "Audio Enhancement",
    time: "3h ago",
    status: "Complete",
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  const first = (
    user?.displayName ||
    user?.email ||
    "there"
  ).split(/[ @]/)[0];

  const [counts, setCounts] = useState<number[]>(
    stats.map(() => 0)
  );

  const [liveJobs, setLiveJobs] = useState(7);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // Animated counter for stats
  useEffect(() => {
    const start = performance.now();
    const dur = 1400;

    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);

      const eased = 1 - Math.pow(1 - t, 3);

      setCounts(
        stats.map((s) => s.target * eased)
      );

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  // Live active jobs ticker
  useEffect(() => {
    const id = setInterval(() => {
      setLiveJobs((n) =>
        Math.max(
          3,
          Math.min(
            14,
            n + (Math.random() > 0.5 ? 1 : -1)
          )
        )
      );
    }, 2500);

    return () => clearInterval(id);
  }, []);

  const fmt = (
    n: number,
    decimals = 0
  ) =>
    decimals > 0
      ? n.toFixed(decimals)
      : Math.round(n).toLocaleString();

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title={
          <>
            Welcome back,{" "}
            <span className="text-foreground">
              {first}
            </span>
          </>
        }
        description="Your AI audio command center. Upload a file, pick a tool, or let intelligent processing decide."
        actions={
          <Button
            asChild
            className="bg-gradient-primary shadow-glow"
          >
            <Link to="/intelligent-processing">
              <Sparkles className="size-4 mr-2" />
              New AI Job
            </Link>
          </Button>
        }
      />

      {/* Hero card */}
      <div className="relative glass-strong rounded-3xl p-6 sm:p-8 mb-6 overflow-hidden">
        <div
          aria-hidden
          className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/30 blur-3xl"
        />

        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center relative">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-primary/80 font-medium mb-2">
              Quick Upload
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Drop a file and Sound-Rix does the
              rest.
            </h2>

            <p className="text-muted-foreground mt-2 max-w-xl text-sm">
              Auto-detect content, apply the
              optimal chain, and export
              broadcast-ready audio.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                asChild
                className="bg-gradient-primary shadow-glow"
              >
                <Link to="/intelligent-processing">
                  <Upload className="size-4 mr-2" />
                  Upload Audio
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="bg-white/5 border-white/15"
              >
                <Link to="/analytics">
                  View Analytics
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden md:block w-72 h-24 text-primary">
            <Waveform
              bars={56}
              seed={11}
              color="currentColor"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="glass-strong rounded-2xl p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>

                <div className="font-display text-2xl sm:text-3xl font-bold mt-1 tabular-nums">
                  {s.prefix}
                  {fmt(
                    counts[i],
                    s.decimals ?? 0
                  )}
                  {s.suffix}
                </div>
              </div>

              <div className="size-10 rounded-xl bg-primary/15 grid place-items-center text-primary">
                <s.icon className="size-5" />
              </div>
            </div>

            <div className="text-xs text-emerald-400 mt-2">
              {s.delta} this week
            </div>
          </div>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {tools.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group relative glass-strong rounded-2xl p-5 hover:-translate-y-0.5 transition-all shadow-card"
          >
            <div
              className={`size-11 rounded-xl bg-gradient-to-br ${t.accent} grid place-items-center shadow-glow mb-4`}
            >
              <t.icon className="size-5 text-white" />
            </div>

            <div className="font-display font-semibold">
              {t.title}
            </div>

            <div className="text-sm text-muted-foreground mt-1">
              {t.desc}
            </div>

            <div className="flex items-center gap-1 text-xs text-primary mt-4 group-hover:gap-2 transition-all">
              Open
              <ArrowRight className="size-3.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Processing Activity
              </div>

              <div className="font-display font-semibold">
                Jobs & quality gain · last 7
                days
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-1 text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {liveJobs} active now
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="g1"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#575fb9"
                      stopOpacity={0.6}
                    />
                    <stop
                      offset="100%"
                      stopColor="#575fb9"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient
                    id="g2"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#2dd4bf"
                      stopOpacity={0.45}
                    />
                    <stop
                      offset="100%"
                      stopColor="#2dd4bf"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

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
                    background:
                      "rgba(19,20,42,0.95)",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "white",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="jobs"
                  stroke="#575fb9"
                  strokeWidth={2}
                  fill="url(#g1)"
                />

                <Area
                  type="monotone"
                  dataKey="gain"
                  stroke="#2dd4bf"
                  strokeWidth={2}
                  fill="url(#g2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Recent Jobs
              </div>

              <div className="font-display font-semibold">
                Latest processing
              </div>
            </div>
          </div>

          <ul className="space-y-3">
            {recent.map((r) => (
              <li
                key={r.name}
                className="glass rounded-xl p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {r.name}
                    </div>

                    <div className="text-[11px] text-muted-foreground">
                      {r.tool} · {r.time}
                    </div>
                  </div>

                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                    {r.status}
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