import { useCallback, useRef, useState, type ReactNode } from "react";
import { Upload, Play, Pause, Download, RotateCcw, Sparkles, Loader2 } from "lucide-react";
import PageHeader from "./PageHeader";
import Waveform from "./Waveform";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ToolControl {
  id: string;
  label: string;
  description?: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface ToolToggle {
  id: string;
  label: string;
  description?: string;
  defaultValue?: boolean;
}

interface Props {
  eyebrow: string;
  title: ReactNode;
  description: string;
  accent: string;
  presets: string[];
  controls: ToolControl[];
  toggles?: ToolToggle[];
  metrics: { label: string; value: string; sub?: string }[];
}

export default function ToolPage({
  eyebrow,
  title,
  description,
  accent,
  presets,
  controls,
  toggles = [],
  metrics,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activePreset, setActivePreset] = useState(presets[0]);
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(controls.map((c) => [c.id, c.defaultValue]))
  );
  const [bools, setBools] = useState<Record<string, boolean>>(
    Object.fromEntries(toggles.map((t) => [t.id, t.defaultValue ?? true]))
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("audio/") && !/\.(mp3|wav|flac|m4a|ogg|aac)$/i.test(f.name)) {
      toast.error("Please upload an audio file (mp3, wav, flac, m4a, ogg, aac).");
      return;
    }
    setFile(f);
    toast.success(`Loaded ${f.name}`);
  }, []);

  const onProcess = () => {
    if (!file) {
      toast.error("Upload an audio file first.");
      return;
    }
    setProcessing(true);
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setProcessing(false);
          toast.success("Processing complete · Download ready");
          return 100;
        }
        return p + 5;
      });
    }, 120);
  };

  const reset = () => {
    setValues(Object.fromEntries(controls.map((c) => [c.id, c.defaultValue])));
    setBools(Object.fromEntries(toggles.map((t) => [t.id, t.defaultValue ?? true])));
    setActivePreset(presets[0]);
    setProgress(0);
    toast("Settings reset to default");
  };

  return (
    <div>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <>
            <Button variant="outline" onClick={reset} className="bg-white/5 border-white/15">
              <RotateCcw className="size-4 mr-2" /> Reset
            </Button>
            <Button onClick={onProcess} disabled={processing} className="bg-gradient-primary shadow-glow">
              {processing ? (
                <><Loader2 className="size-4 mr-2 animate-spin" /> Processing…</>
              ) : (
                <><Sparkles className="size-4 mr-2" /> Process with AI</>
              )}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column: upload + waveform + presets */}
        <div className="xl:col-span-2 space-y-6">
          {/* Upload */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "glass-strong rounded-2xl p-8 sm:p-10 cursor-pointer transition-all",
              "border-2 border-dashed",
              drag ? "border-primary bg-primary/5" : "border-white/10 hover:border-primary/50"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
            />
            <div className="flex items-center gap-4">
              <div
                className="size-14 rounded-2xl grid place-items-center shadow-glow"
                style={{ background: accent }}
              >
                <Upload className="size-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-lg truncate">
                  {file ? file.name : "Drop your audio file here"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {file
                    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB · ${file.type || "audio"}`
                    : "Supports WAV, MP3, FLAC, M4A, OGG, AAC · Up to 500MB"}
                </div>
              </div>
              <Button type="button" variant="outline" className="bg-white/5 border-white/15 hidden sm:inline-flex">
                Browse
              </Button>
            </div>
          </div>

          {/* Waveform compare */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Preview</div>
                <div className="font-display font-semibold">Original vs Processed</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPlaying((p) => !p)}
                  className="bg-white/5 border-white/15"
                >
                  {playing ? <Pause className="size-4 mr-1" /> : <Play className="size-4 mr-1" />}
                  {playing ? "Pause" : "Play"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={progress < 100}
                  className="bg-white/5 border-white/15"
                >
                  <Download className="size-4 mr-1" /> Export
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <WaveBlock label="Original" color="oklch(0.78 0.03 270)" seed={4} />
              <WaveBlock label="Processed" color={accent} seed={21} intensity={1.15} />
            </div>

            {processing || progress > 0 ? (
              <div className="mt-5">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>{processing ? "AI is processing…" : "Complete"}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Presets */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              AI Presets
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePreset(p)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                    activePreset === p
                      ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                      : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: controls + metrics */}
        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
              Controls
            </div>
            <div className="space-y-5">
              {controls.map((c) => (
                <div key={c.id}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <Label className="text-sm">{c.label}</Label>
                    <span className="text-xs tabular-nums text-primary font-medium">
                      {values[c.id]}
                      {c.unit ?? ""}
                    </span>
                  </div>
                  <Slider
                    value={[values[c.id]]}
                    min={c.min ?? 0}
                    max={c.max ?? 100}
                    step={c.step ?? 1}
                    onValueChange={(v) => setValues((s) => ({ ...s, [c.id]: v[0] }))}
                  />
                  {c.description && (
                    <p className="text-[11px] text-muted-foreground mt-1.5">{c.description}</p>
                  )}
                </div>
              ))}

              {toggles.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-3">
                  {toggles.map((t) => (
                    <div key={t.id} className="flex items-center justify-between gap-3">
                      <div>
                        <Label className="text-sm">{t.label}</Label>
                        {t.description && (
                          <p className="text-[11px] text-muted-foreground">{t.description}</p>
                        )}
                      </div>
                      <Switch
                        checked={bools[t.id]}
                        onCheckedChange={(v) => setBools((s) => ({ ...s, [t.id]: v }))}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="glass rounded-xl p-4">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </div>
                <div className="font-display text-2xl font-bold mt-1">{m.value}</div>
                {m.sub && <div className="text-[11px] text-muted-foreground mt-0.5">{m.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WaveBlock({ label, color, seed, intensity = 1 }: { label: string; color: string; seed: number; intensity?: number }) {
  return (
    <div className="rounded-xl bg-black/30 border border-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{label}</div>
      <div className="h-20" style={{ color }}>
        <Waveform seed={seed} bars={120} color={color} intensity={intensity} />
      </div>
    </div>
  );
}