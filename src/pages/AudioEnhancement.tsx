import { useEffect, useState } from "react";
import { Disc3, Music2, Headphones, Radio } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const bands = [
  { hz: "60Hz", label: "Sub" },
  { hz: "150Hz", label: "Bass" },
  { hz: "400Hz", label: "Low Mid" },
  { hz: "1kHz", label: "Mid" },
  { hz: "3kHz", label: "Presence" },
  { hz: "6kHz", label: "Brilliance" },
  { hz: "12kHz", label: "Air" },
  { hz: "16kHz", label: "Ultra" },
];

const presets = [
  {
    id: "studio",
    name: "Studio Master",
    desc: "Reference-grade balance",
    icon: Disc3,
    curve: [55, 60, 50, 52, 65, 70, 75, 68],
  },
  {
    id: "podcast",
    name: "Podcast Polish",
    desc: "Voice forward, warm body",
    icon: Headphones,
    curve: [40, 55, 65, 72, 78, 60, 50, 45],
  },
  {
    id: "music",
    name: "Music Revive",
    desc: "Restore old recordings",
    icon: Music2,
    curve: [70, 75, 55, 50, 62, 75, 80, 78],
  },
  {
    id: "vinyl",
    name: "Vinyl Warmth",
    desc: "Analog tape character",
    icon: Radio,
    curve: [80, 78, 70, 65, 55, 50, 45, 40],
  },
];

export default function AudioEnhancement() {
  const [active, setActive] = useState(presets[0].id);
  const [eq, setEq] = useState<number[]>(presets[0].curve);
  const [animLevels, setAnimLevels] = useState<number[]>(
    Array(24).fill(20)
  );

  // Scroll page to top when component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update EQ when preset changes
  useEffect(() => {
    const p = presets.find((p) => p.id === active);

    if (p) {
      setEq(p.curve);
    }
  }, [active]);

  // Animate spectrum analyzer
  useEffect(() => {
    const t = setInterval(() => {
      setAnimLevels(
        Array.from({ length: 24 }, () => 20 + Math.random() * 80)
      );
    }, 220);

    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Mastering Studio"
        title={
          <>
            Audio <span className="text-gradient">Enhancement</span>
          </>
        }
        description="Neural mastering with an 8-band parametric EQ trained on 1M+ hours of studio-grade audio."
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Mixing Console */}
        <div className="glass-strong rounded-3xl p-5 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-primary/80 font-semibold">
                Parametric EQ
              </div>

              <div className="font-display text-lg font-semibold">
                8-Band Mastering Console
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 px-3 py-1 text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Engine Active
            </div>
          </div>

          {/* Spectrum Analyzer */}
          <div className="relative h-24 mb-6 rounded-xl bg-black/40 border border-white/5 p-2 overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(87,95,185,0.12))]"
            />

            <div className="relative flex items-end justify-between h-full gap-[2px]">
              {animLevels.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-primary/40 via-primary to-cyan-300 transition-all duration-200"
                  style={{
                    height: `${v}%`,
                    opacity: 0.6 + v / 200,
                  }}
                />
              ))}
            </div>
          </div>

          {/* EQ Bands */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
            {bands.map((b, i) => (
              <div key={b.hz} className="flex flex-col items-center">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                  {b.label}
                </div>

                <div className="relative h-48 w-full flex items-center justify-center">
                  <Slider
                    orientation="vertical"
                    value={[eq[i]]}
                    min={0}
                    max={100}
                    onValueChange={(v) =>
                      setEq((s) =>
                        s.map((x, idx) => (idx === i ? v[0] : x))
                      )
                    }
                    className="h-full"
                  />
                </div>

                <div className="text-[10px] font-mono tabular-nums text-primary mt-2">
                  {(eq[i] - 50 > 0 ? "+" : "") +
                    ((eq[i] - 50) / 5).toFixed(1)}{" "}
                  dB
                </div>

                <div className="text-[9px] text-muted-foreground/70 mt-0.5">
                  {b.hz}
                </div>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
            {[
              { l: "Loudness", v: "-14.0 LUFS" },
              { l: "True Peak", v: "-1.0 dBTP" },
              { l: "Dynamic Range", v: "11.2 dB" },
              { l: "AI Confidence", v: "98%" },
            ].map((m) => (
              <div key={m.l} className="glass rounded-xl p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {m.l}
                </div>

                <div className="font-display font-bold text-lg tabular-nums">
                  {m.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preset Rack */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.22em] text-primary/80 font-semibold mb-2 px-1">
            Mastering Presets
          </div>

          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={cn(
                "w-full text-left glass-strong rounded-2xl p-4 transition-all border",
                active === p.id
                  ? "border-primary/60 shadow-glow bg-gradient-to-r from-primary/15 to-transparent"
                  : "border-white/10 hover:border-primary/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center shrink-0">
                  <p.icon className="size-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">
                    {p.name}
                  </div>

                  <div className="text-[11px] text-muted-foreground truncate">
                    {p.desc}
                  </div>
                </div>
              </div>

              <div className="flex items-end gap-[2px] h-8 mt-3">
                {p.curve.map((c, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-primary/60"
                    style={{ height: `${c}%` }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}