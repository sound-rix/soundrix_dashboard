import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  User,
  Shield,
  ArrowRight,
  Command,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

const searchIndex: { label: string; path: string; tag: string }[] = [
  { label: "Dashboard", path: "/", tag: "Overview" },
  { label: "Audio Enhancement", path: "/audio-enhancement", tag: "Tool" },
  { label: "Noise Reduction", path: "/noise-reduction", tag: "Tool" },
  {
    label: "Intelligent Processing",
    path: "/intelligent-processing",
    tag: "Tool",
  },
  {
    label: "Speech Optimization",
    path: "/speech-optimization",
    tag: "Tool",
  },
  { label: "Analytics", path: "/analytics", tag: "Insights" },
  { label: "Settings", path: "/settings", tag: "Account" },
];

interface Props {
  onMenu: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query})`, "ig");

  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span
        key={i}
        className="text-primary font-semibold"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function Topbar({
  onMenu,
  onToggleCollapse,
  collapsed,
}: Props) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!q.trim()) return [];

    const needle = q.toLowerCase();

    return searchIndex.filter((i) =>
      i.label.toLowerCase().includes(needle)
    );
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDoc);

    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [q]);

  const go = (path: string) => {
    navigate(path);
    setQ("");
    setOpen(false);
  };

  const initials =
    (user?.displayName || user?.email || "U")
      .split(/[ @.]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "U";

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B1020]/70 backdrop-blur-2xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">

        {/* LEFT */}
        <button
          className="lg:hidden rounded-xl p-2 hover:bg-white/5 transition"
          onClick={onMenu}
        >
          <Menu className="size-5" />
        </button>

        <button
          className="hidden lg:inline-flex rounded-xl p-2 hover:bg-white/5 text-muted-foreground transition"
          onClick={onToggleCollapse}
        >
          {collapsed ? (
            <PanelLeft className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </button>

        {/* SEARCH */}
        <div
          ref={boxRef}
          className="relative flex-1 max-w-2xl"
        >
          {/* SEARCH INPUT */}
          <div className="relative group">
            {/* glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 opacity-0 blur transition duration-300 group-focus-within:opacity-100" />

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />

              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => {
                  if (!results.length) return;

                  if (e.key === "ArrowDown") {
                    e.preventDefault();

                    setSelectedIndex((prev) =>
                      prev === results.length - 1 ? 0 : prev + 1
                    );
                  }

                  if (e.key === "ArrowUp") {
                    e.preventDefault();

                    setSelectedIndex((prev) =>
                      prev === 0 ? results.length - 1 : prev - 1
                    );
                  }

                  if (e.key === "Enter") {
                    e.preventDefault();

                    if (results[selectedIndex]) {
                      go(results[selectedIndex].path);
                    }
                  }

                  if (e.key === "Escape") {
                    setOpen(false);
                  }
                }}
                placeholder="Search tools, AI modules, analytics..."
                className={cn(
                  "w-full rounded-2xl",
                  "border border-white/10",
                  "bg-white/[0.04]",
                  "pl-11 pr-24 py-3",
                  "text-sm text-white",
                  "placeholder:text-muted-foreground",
                  "backdrop-blur-xl",
                  "transition-all duration-200",
                  "focus:outline-none",
                  "focus:border-primary/30",
                  "focus:bg-white/[0.06]",
                  "focus:ring-2 focus:ring-primary/20"
                )}
              />

              {/* CMD */}
              <div className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-muted-foreground sm:flex">
                <Command className="size-3" />
                K
              </div>
            </div>
          </div>

          {/* DROPDOWN */}
          {open && q && (
            <div
              className="
                absolute mt-3 w-full overflow-hidden rounded-3xl
                border border-white/10
                bg-[#0B1020]/95
                backdrop-blur-3xl
                shadow-[0_25px_100px_rgba(0,0,0,0.75)]
                animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200
              "
            >
              {/* TOP LIGHT */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />

              {/* AMBIENT GLOW */}
              <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

              <div className="relative z-10">

                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80 font-semibold">
                      Quick Navigation
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Search pages, tools and AI modules
                    </p>
                  </div>

                  <div className="hidden items-center gap-2 text-[10px] text-muted-foreground sm:flex">
                    <kbd className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1">
                      ESC
                    </kbd>
                    Close
                  </div>
                </div>

                {/* EMPTY */}
                {results.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                      <Search className="size-5 text-muted-foreground" />
                    </div>

                    <p className="text-sm font-medium text-white">
                      No results found
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Try another keyword
                    </p>
                  </div>
                ) : (
                  <>
                    {/* RESULTS */}
                    <ul className="max-h-[360px] overflow-y-auto p-2 space-y-1.5">
                      {results.map((r, index) => (
                        <li key={r.path}>
                          <button
                            onClick={() => go(r.path)}
                            className={cn(
                              `
                              group relative w-full overflow-hidden
                              rounded-2xl border
                              px-4 py-3.5
                              transition-all duration-200
                            `,
                              selectedIndex === index
                                ? `
                                  border-primary/30
                                  bg-primary/[0.08]
                                  shadow-[0_0_30px_rgba(99,102,241,0.18)]
                                `
                                : `
                                  border-transparent
                                  bg-white/[0.03]
                                  hover:border-primary/20
                                  hover:bg-white/[0.06]
                                `
                            )}
                          >
                            {/* hover glow */}
                            <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent" />

                            <div className="relative flex items-center justify-between gap-4">

                              {/* LEFT */}
                              <div className="flex items-start gap-3">

                                {/* ICON */}
                                <div
                                  className={cn(
                                    `
                                    mt-0.5 flex size-10 items-center justify-center
                                    rounded-xl border backdrop-blur-xl
                                  `,
                                    selectedIndex === index
                                      ? `
                                        border-primary/30
                                        bg-primary/10
                                      `
                                      : `
                                        border-white/10
                                        bg-white/[0.04]
                                      `
                                  )}
                                >
                                  <Search className="size-4 text-primary" />
                                </div>

                                {/* TEXT */}
                                <div className="text-left">
                                  <div className="font-medium text-white">
                                    {highlight(r.label, q)}
                                  </div>

                                  <div className="mt-1 text-xs text-muted-foreground">
                                    {r.path}
                                  </div>
                                </div>
                              </div>

                              {/* RIGHT */}
                              <div className="flex items-center gap-3">

                                <span
                                  className="
                                    rounded-full border border-primary/20
                                    bg-primary/10
                                    px-2.5 py-1
                                    text-[10px]
                                    uppercase tracking-wider
                                    text-primary
                                    font-semibold
                                  "
                                >
                                  {r.tag}
                                </span>

                                <div
                                  className={cn(
                                    `
                                    rounded-full border p-2 transition
                                  `,
                                    selectedIndex === index
                                      ? `
                                        border-primary/30
                                        bg-primary/10
                                      `
                                      : `
                                        border-white/10
                                        bg-white/[0.04]
                                      `
                                  )}
                                >
                                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary transition" />
                                </div>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>

                    {/* FOOTER */}
                    <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                      <div className="text-[11px] text-muted-foreground">
                        {results.length} result
                        {results.length > 1 ? "s" : ""}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <kbd className="rounded border border-white/10 bg-white/[0.04] px-2 py-1">
                          ↵
                        </kbd>
                        Open Result
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">

          {/* LIVE STATUS */}
          <div
            className="
              hidden md:flex items-center gap-1.5
              rounded-full border border-emerald-400/20
              bg-emerald-400/10
              px-3 py-1.5
              text-[10px]
              uppercase tracking-wider
              text-emerald-300
              font-semibold
            "
          >
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>

          {/* USER MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="
                  flex items-center gap-2.5
                  rounded-full
                  border border-white/10
                  bg-white/[0.04]
                  pl-1 pr-3 py-1
                  transition
                  hover:bg-white/[0.06]
                "
              >
                <Avatar className="size-8 border border-white/10">
                  {user?.photoURL && (
                    <AvatarImage src={user.photoURL} />
                  )}

                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-sm font-semibold">
                    {user?.displayName || "User"}
                  </span>

                  <span className="flex items-center gap-1 text-[10px] uppercase text-primary">
                    <Shield className="size-2.5" />
                    Admin
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-60"
            >
              <DropdownMenuLabel>
                <div className="font-semibold">
                  {user?.displayName}
                </div>

                <div className="text-xs text-muted-foreground">
                  {user?.email}
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate("/settings")}
              >
                <User className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}