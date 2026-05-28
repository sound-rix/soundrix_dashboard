import { useMemo } from "react";

interface Props {
  seed?: number;
  bars?: number;
  color?: string;
  className?: string;
  intensity?: number;
  animated?: boolean;
}

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function Waveform({
  seed = 7,
  bars = 80,
  color = "currentColor",
  className = "",
  intensity = 1,
  animated = true,
}: Props) {
  const heights = useMemo(() => {
    const r = rand(seed);
    return Array.from({ length: bars }, (_, i) => {
      const env = Math.sin((i / bars) * Math.PI);
      return Math.max(6, (r() * 0.7 + env * 0.5) * 100 * intensity);
    });
  }, [seed, bars, intensity]);

  return (
    <div className={`flex items-center gap-[2px] h-full w-full ${className}`} aria-hidden>
      {heights.map((h, i) => (
        <div
          key={i}
          className={animated ? "animate-pulse-slow" : ""}
          style={{
            height: `${h}%`,
            width: "100%",
            background: color,
            borderRadius: 2,
            animationDelay: `${(i % 20) * 80}ms`,
            opacity: 0.55 + (h / 100) * 0.45,
          }}
        />
      ))}
    </div>
  );
}