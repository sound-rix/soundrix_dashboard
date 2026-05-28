import { useEffect, useState } from "react";
import {
  Mic,
  Play,
  Pause,
  User2,
  Sparkles,
  Wind,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const transcript = [
  {
    t: "00:00",
    spk: "S1",
    text: "Welcome back to the Sound-Rix podcast — episode forty-two.",
    emo: "warm",
  },
  {
    t: "00:04",
    spk: "S1",
    text: "Today we're diving into the neuroscience of voice clarity.",
    emo: "neutral",
  },
  {
    t: "00:09",
    spk: "S2",
    text: "Yeah, it's honestly fascinating how the brain locks onto a single speaker.",
    emo: "excited",
  },
  {
    t: "00:14",
    spk: "S1",
    text: "Right — the so-called cocktail party effect.",
    emo: "neutral",
  },
  {
    t: "00:17",
    spk: "S2",
    text: "And our new model replicates that selective attention.",
    emo: "confident",
  },
  {
    t: "00:21",
    spk: "S1",
    text: "Let's break down exactly how it works.",
    emo: "warm",
  },
];

const speakers = [
  {
    id: "S1",
    name: "Alex Carter",
    clarity: 94,
    pace: 162,
    loud: -14.2,
    color: "from-primary to-violet-500",
  },
  {
    id: "S2",
    name: "Priya Shah",
    clarity: 91,
    pace: 178,
    loud: -13.8,
    color: "from-teal-400 to-emerald-500",
  },
];

export default function SpeechOptimization() {
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [vad, setVad] = useState<number[]>(Array(60).fill(40));

  // ✅ ADDED: scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!playing) return;

    const id = setInterval(() => {
      setPos((p) => (p + 1) % transcript.length);
    }, 1200);

    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    const t = setInterval(() => {
      setVad((arr) => [
        ...arr.slice(1),
        25 + Math.random() * 75,
      ]);
    }, 90);

    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Voice AI · Broadcast Suite"
        title={
          <>
            Speech{" "}
            <span className="text-gradient">
              Optimization
            </span>
          </>
        }
        description="Real-time transcript, speaker diarisation and per-voice mastering for podcasts, lectures, audiobooks and calls."
        actions={
          <Button className="bg-gradient-primary shadow-glow">
            <Sparkles className="size-4 mr-2" />
            Optimise Voices
          </Button>
        }
      />

      {/* Speaker cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {speakers.map((s) => (
          <div
            key={s.id}
            className="glass-strong rounded-2xl p-5"
          >
            <div className="flex items-center gap-4">
              <div
                className={`size-14 rounded-2xl bg-gradient-to-br ${s.color} grid place-items-center shadow-glow`}
              >
                <User2 className="size-7 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Speaker {s.id}
                </div>
                <div className="font-display text-lg font-bold truncate">
                  {s.name}
                </div>
              </div>

              <div className="text-right">
                <div className="font-display text-2xl font-bold text-primary tabular-nums">
                  {s.clarity}
                </div>
                <div className="text-[10px] uppercase text-muted-foreground">
                  STOI
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <Stat l="Pace" v={`${s.pace} wpm`} />
              <Stat l="Loudness" v={`${s.loud} LU`} />
              <Stat l="Sibilance" v="Low" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        {/* Transcript timeline */}
        <div className="glass-strong rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-primary/80 font-semibold">
                Live Transcript
              </div>
              <div className="font-display text-lg font-semibold">
                Speaker diarisation · 99.2%
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setPlaying((p) => !p)}
              variant="outline"
              className="bg-white/5 border-white/15"
            >
              {playing ? (
                <Pause className="size-4 mr-1" />
              ) : (
                <Play className="size-4 mr-1" />
              )}
              {playing ? "Pause" : "Play"}
            </Button>
          </div>

          {/* VAD waveform */}
          <div className="h-16 rounded-xl bg-black/40 border border-white/5 p-2 mb-5 flex items-end gap-[2px]">
            {vad.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-primary/40 via-primary to-teal-300 transition-all duration-100"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>

          <ul className="space-y-2.5">
            {transcript.map((line, i) => {
              const spk = speakers.find(
                (s) => s.id === line.spk
              )!;
              const active = i === pos;

              return (
                <li
                  key={i}
                  className={cn(
                    "flex gap-3 sm:gap-4 rounded-xl p-3 transition-all border",
                    active
                      ? "bg-primary/10 border-primary/40 shadow-glow"
                      : "bg-white/[0.02] border-transparent"
                  )}
                >
                  <div className="text-[10px] font-mono text-muted-foreground pt-1 tabular-nums w-12 shrink-0">
                    {line.t}
                  </div>

                  <div
                    className={`size-8 shrink-0 rounded-lg bg-gradient-to-br ${spk.color} grid place-items-center text-[10px] font-bold text-white`}
                  >
                    {line.spk}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm leading-relaxed">
                      {line.text}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                      {spk.name} · tone: {line.emo}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Controls */}
        <div className="glass-strong rounded-2xl p-6 self-start space-y-5">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-primary/80 font-semibold">
              Voice Mastering
            </div>
            <div className="font-display font-semibold mt-1">
              Per-speaker tuning
            </div>
          </div>

          {[
            { l: "Intelligibility", v: 84 },
            { l: "Tonal Balance", v: 58 },
            { l: "Pacing Smoothness", v: 42 },
            { l: "Target Loudness (LUFS)", v: 70 },
          ].map((c) => (
            <SliderRow key={c.l} label={c.l} initial={c.v} />
          ))}

          <div className="pt-4 border-t border-white/10 space-y-3">
            {[
              { l: "Breath Reduction", on: true, icon: Wind },
              { l: "Mouth Click Removal", on: true, icon: Mic },
              { l: "Auto-Leveler", on: false, icon: Sparkles },
            ].map((t) => (
              <button
                key={t.l}
                className={cn(
                  "w-full flex items-center justify-between gap-3 rounded-xl p-3 border transition-all",
                  t.on
                    ? "bg-primary/10 border-primary/40"
                    : "bg-white/5 border-white/10"
                )}
              >
                <span className="flex items-center gap-2 text-sm">
                  <t.icon className="size-4 text-primary" />{" "}
                  {t.l}
                </span>

                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold",
                    t.on
                      ? "bg-emerald-400/15 text-emerald-300"
                      : "bg-white/5 text-muted-foreground"
                  )}
                >
                  {t.on ? "On" : "Off"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ l, v }: { l: string; v: string }) {
  return (
    <div className="glass rounded-lg p-2">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
        {l}
      </div>
      <div className="text-sm font-semibold tabular-nums">
        {v}
      </div>
    </div>
  );
}

function SliderRow({
  label,
  initial,
}: {
  label: string;
  initial: number;
}) {
  const [v, setV] = useState(initial);

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span className="text-primary font-medium tabular-nums">
          {v}%
        </span>
      </div>

      <Slider
        value={[v]}
        max={100}
        onValueChange={(n) => setV(n[0])}
      />
    </div>
  );
}