import { useEffect, useMemo, useState } from "react";
import { Wind, Zap, Droplets, Volume2, Waves } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const noiseTypes = [
  {
    id: "hum",
    icon: Zap,
    label: "50/60 Hz Hum",
    count: 142,
    color: "from-amber-400 to-orange-500",
  },
  {
    id: "wind",
    icon: Wind,
    label: "Wind & Outdoor",
    count: 89,
    color: "from-sky-400 to-cyan-500",
  },
  {
    id: "rain",
    icon: Droplets,
    label: "Room Tone",
    count: 217,
    color: "from-violet-400 to-purple-500",
  },
  {
    id: "click",
    icon: Volume2,
    label: "Click & Pop",
    count: 34,
    color: "from-rose-400 to-pink-500",
  },
];

// Generate static spectrogram cells
function genSpectro(rows: number, cols: number, processed = false) {
  const cells: number[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const env = Math.sin((x / cols) * Math.PI * 2) * 0.3 + 0.5;
      const band = y < rows * 0.3 ? 0.9 : y > rows * 0.7 ? 0.4 : 0.7;

      let v = env * band + Math.random() * 0.35;

      if (processed && (y < rows * 0.25 || y > rows * 0.75)) {
        v *= 0.25;
      }

      cells.push(Math.min(1, v));
    }
  }

  return cells;
}

export default function NoiseReduction() {
  const rows = 18;
  const cols = 56;

  const original = useMemo(() => genSpectro(rows, cols), []);
  const processed = useMemo(() => genSpectro(rows, cols, true), []);

  const [reduce, setReduce] = useState(65);
  const [preserve, setPreserve] = useState(80);
  const [smooth, setSmooth] = useState(35);
  const [meter, setMeter] = useState(0);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Live noise floor animation
  useEffect(() => {
    const t = setInterval(() => {
      setMeter(20 + Math.random() * 60);
    }, 180);

    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Spectral AI · Restoration"
        title={
          <>
            Surgical <span className="text-gradient">Noise Reduction</span>
          </>
        }
        description="Real-time spectrogram analysis isolates noise from voice with sub-millisecond precision. Trained on 480 noise profiles."
      />

      {/* Noise Type Detector Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {noiseTypes.map((n) => (
          <div key={n.id} className="glass-strong rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div
                className={`size-10 rounded-xl bg-gradient-to-br ${n.color} grid place-items-center shadow-glow`}
              >
                <n.icon className="size-5 text-white" />
              </div>

              <div className="text-right">
                <div className="text-2xl font-display font-bold tabular-nums">
                  {n.count}
                </div>

                <div className="text-[10px] uppercase text-muted-foreground">
                  detected
                </div>
              </div>
            </div>

            <div className="text-sm font-medium">{n.label}</div>

            <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${n.color}`}
                style={{
                  width: `${Math.min(100, n.count / 2.5)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Spectrograms */}
        <div className="space-y-4">
          <Spectrogram
            title="Original Signal"
            subtitle="Noise envelope: -42 dB RMS"
            cells={original}
            rows={rows}
            cols={cols}
            mode="original"
          />

          <Spectrogram
            title="After Neural Mask"
            subtitle="Floor: -72 dB · SNR +18.4 dB"
            cells={processed}
            rows={rows}
            cols={cols}
            mode="processed"
          />

          {/* Live Noise Floor Meter */}
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Live Noise Floor
                </div>

                <div className="font-display font-semibold flex items-center gap-2">
                  <Waves className="size-4 text-primary" />
                  Real-time monitor
                </div>
              </div>

              <div className="text-2xl font-display font-bold tabular-nums text-primary">
                -{(72 - meter / 5).toFixed(1)} dB
              </div>
            </div>

            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-200"
                style={{ width: `${meter}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-strong rounded-2xl p-6 self-start space-y-6">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-primary/80 font-semibold">
              Mask Controls
            </div>

            <div className="font-display font-semibold mt-1">
              Fine-tune the AI
            </div>
          </div>

          {[
            {
              l: "Noise Reduction",
              v: reduce,
              s: setReduce,
              u: "%",
            },
            {
              l: "Speech Preservation",
              v: preserve,
              s: setPreserve,
              u: "%",
            },
            {
              l: "Spectral Smoothing",
              v: smooth,
              s: setSmooth,
              u: "%",
            },
          ].map((c) => (
            <div key={c.l}>
              <div className="flex justify-between text-sm mb-2">
                <span>{c.l}</span>

                <span className="text-primary font-medium tabular-nums">
                  {c.v}
                  {c.u}
                </span>
              </div>

              <Slider
                value={[c.v]}
                max={100}
                onValueChange={(v) => c.s(v[0])}
              />
            </div>
          ))}

          <div className="pt-4 border-t border-white/10 space-y-3">
            {[
              { l: "Hum Remover (50/60 Hz)" },
              { l: "Click & Pop Repair" },
              { l: "Neural Voice Isolation" },
            ].map((t, i) => (
              <div
                key={t.l}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{t.l}</span>

                <Switch defaultChecked={i !== 1} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Spectrogram({
  title,
  subtitle,
  cells,
  rows,
  cols,
  mode,
}: {
  title: string;
  subtitle: string;
  cells: number[];
  rows: number;
  cols: number;
  mode: "original" | "processed";
}) {
  return (
    <div className="glass-strong rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {title}
          </div>

          <div className="font-display font-semibold">
            {subtitle}
          </div>
        </div>

        <span
          className={cn(
            "text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-semibold",
            mode === "original"
              ? "bg-rose-400/15 text-rose-300"
              : "bg-emerald-400/15 text-emerald-300"
          )}
        >
          {mode === "original" ? "Raw" : "AI Cleaned"}
        </span>
      </div>

      <div
        className="grid gap-[1px] rounded-lg overflow-hidden bg-black/40 p-1"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
        }}
      >
        {cells.map((v, i) => {
          const hue =
            mode === "original"
              ? 280 - v * 60
              : 200 - v * 30;

          return (
            <div
              key={i}
              style={{
                background: `hsl(${hue} 85% ${30 + v * 50}% / ${
                  0.15 + v * 0.85
                })`,
                aspectRatio: "1 / 2",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}