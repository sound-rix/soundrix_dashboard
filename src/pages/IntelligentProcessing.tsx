import { useEffect, useState } from "react";
import {
  Brain,
  Mic2,
  Filter,
  AudioWaveform,
  Gauge,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Cpu,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pipeline = [
  {
    id: "detect",
    icon: Brain,
    label: "Scene Detection",
    desc: "Podcast · 2 speakers",
  },
  {
    id: "isolate",
    icon: Mic2,
    label: "Voice Isolation",
    desc: "Neural mask · 94%",
  },
  {
    id: "denoise",
    icon: Filter,
    label: "Noise Removal",
    desc: "-18.4 dB floor",
  },
  {
    id: "eq",
    icon: AudioWaveform,
    label: "Adaptive EQ",
    desc: "8 bands tuned",
  },
  {
    id: "comp",
    icon: Gauge,
    label: "Compression",
    desc: "3:1 · soft knee",
  },
  {
    id: "master",
    icon: Sparkles,
    label: "AI Mastering",
    desc: "-14 LUFS · streaming",
  },
];

const scenes = [
  "Podcast",
  "Interview",
  "Lecture",
  "Music",
  "Field Recording",
  "Phone Call",
];

export default function IntelligentProcessing() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [confidence, setConfidence] = useState(96);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Processing pipeline animation
  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setStep((s) => {
        if (s >= pipeline.length - 1) {
          setRunning(false);
          return pipeline.length - 1;
        }

        return s + 1;
      });
    }, 900);

    return () => clearInterval(id);
  }, [running]);

  // AI confidence animation
  useEffect(() => {
    const t = setInterval(() => {
      setConfidence(92 + Math.random() * 7);
    }, 1400);

    return () => clearInterval(t);
  }, []);

  const start = () => {
    setStep(0);
    setRunning(true);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Adaptive Engine · Rix-3 Pro"
        title={
          <>
            Intelligent{" "}
            <span className="text-gradient">
              Audio Pipeline
            </span>
          </>
        }
        description="Set it and forget it. Our AI analyses content, chains the optimal effects and exports broadcast-ready audio in seconds."
        actions={
          <Button
            onClick={start}
            disabled={running}
            className="bg-gradient-primary shadow-glow"
          >
            {running ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Running…
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" />
                Run Smart Chain
              </>
            )}
          </Button>
        }
      />

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Scene Detection */}
        <div className="glass-strong rounded-2xl p-5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Detected Scene
          </div>

          <div className="font-display text-2xl font-bold mt-1 text-gradient">
            Podcast · Studio
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {scenes.map((s, i) => (
              <span
                key={s}
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full border",
                  i === 0
                    ? "bg-primary/20 border-primary/50 text-primary-foreground"
                    : "bg-white/5 border-white/10 text-muted-foreground"
                )}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* AI Confidence */}
        <div className="glass-strong rounded-2xl p-5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            AI Confidence
          </div>

          <div className="font-display text-2xl font-bold mt-1 tabular-nums">
            {confidence.toFixed(1)}%
          </div>

          <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-primary transition-all duration-700"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* Engine Model */}
        <div className="glass-strong rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Engine Model
              </div>

              <div className="font-display text-2xl font-bold mt-1">
                Rix-3 Pro
              </div>

              <div className="text-[11px] text-muted-foreground mt-0.5">
                1.2B params · v3.4.1
              </div>
            </div>

            <div className="size-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
              <Cpu className="size-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="glass-strong rounded-3xl p-5 sm:p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-primary/80 font-semibold">
              Processing Chain
            </div>

            <div className="font-display text-lg font-semibold">
              6-stage neural pipeline
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            ETA{" "}
            <span className="text-foreground font-semibold tabular-nums">
              0:0
              {Math.max(0, pipeline.length - 1 - step)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipeline.map((p, i) => {
            const done =
              i < step ||
              (!running &&
                step === pipeline.length - 1 &&
                i <= step);

            const active = running && i === step;

            return (
              <div key={p.id} className="relative">
                <div
                  className={cn(
                    "glass rounded-2xl p-4 transition-all duration-500",
                    done &&
                      "bg-emerald-400/10 border-emerald-400/40",
                    active &&
                      "border-primary/70 shadow-glow scale-[1.03] bg-primary/10"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={cn(
                        "size-9 rounded-xl grid place-items-center transition-all",
                        done
                          ? "bg-emerald-400/25 text-emerald-300"
                          : active
                          ? "bg-gradient-primary text-white shadow-glow"
                          : "bg-white/5 text-muted-foreground"
                      )}
                    >
                      <p.icon className="size-4" />
                    </div>

                    {done && (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    )}

                    {active && (
                      <Loader2 className="size-4 text-primary animate-spin" />
                    )}
                  </div>

                  <div className="text-xs font-semibold">
                    {p.label}
                  </div>

                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {p.desc}
                  </div>

                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground mt-2">
                    Stage {i + 1}
                  </div>
                </div>

                {i < pipeline.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 size-4 text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            l: "Throughput",
            v: "12.4x",
            s: "realtime",
          },
          {
            l: "GPU Load",
            v: "68%",
            s: "A100 / FP16",
          },
          {
            l: "Latency",
            v: "42 ms",
            s: "p95",
          },
          {
            l: "Queue",
            v: "0 jobs",
            s: "all clear",
          },
        ].map((m) => (
          <div
            key={m.l}
            className="glass-strong rounded-2xl p-4"
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {m.l}
            </div>

            <div className="font-display text-2xl font-bold mt-1 tabular-nums">
              {m.v}
            </div>

            <div className="text-[11px] text-muted-foreground">
              {m.s}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}