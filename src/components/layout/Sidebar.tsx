import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  AudioWaveform,
  Volume2,
  Brain,
  Mic,
  BarChart3,
  Settings as SettingsIcon,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/audio-enhancement", label: "Audio Enhancement", icon: AudioWaveform },
  { to: "/noise-reduction", label: "Noise Reduction", icon: Volume2 },
  { to: "/intelligent-processing", label: "Intelligent Processing", icon: Brain },
  { to: "/speech-optimization", label: "Speech Optimization", icon: Mic },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

interface Props {
  mobileOpen: boolean;
  onMobileClose: () => void;
  collapsed: boolean;
}

export default function Sidebar({
  mobileOpen,
  onMobileClose,
  collapsed,
}: Props) {
  return (
    <>
      {/* Overlay (mobile) */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden transition-opacity",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onMobileClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col glass-strong border-r border-sidebar-border",
          "transition-all duration-300 ease-out",
          collapsed ? "lg:w-[84px]" : "lg:w-[260px]",
          "w-[280px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-center px-4 border-b border-sidebar-border">
          <Brand />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/5",
                      isActive &&
                      "bg-gradient-primary text-primary-foreground shadow-glow hover:text-primary-foreground"
                    )
                  }
                >
                  <item.icon className="size-5 shrink-0" />
                  <span className={cn("truncate", collapsed && "lg:hidden")}>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Pro Section */}
        <div className={cn("p-3", collapsed && "lg:p-2")}>
          <div
            className={cn(
              "glass rounded-xl p-4 text-xs text-muted-foreground",
              collapsed && "lg:hidden"
            )}
          >
            <div className="flex items-center gap-2 mb-1 text-foreground font-medium">
              <Sparkles className="size-4 text-primary" />
              Pro Tier
            </div>
            Unlock unlimited AI audio processing & batch jobs.
          </div>
        </div>
      </aside>
    </>
  );
}

/* ===================== BRAND (LOGO ONLY) ===================== */

function Brand() {
  return (
    <div className="flex items-center justify-center">

      <img
        src="/logo.png"
        alt="Sound-Rix Logo"
        className="w-18 h-auto object-contain"
      />
    </div>

  );
}