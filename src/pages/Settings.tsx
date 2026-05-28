import { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Settings() {
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.displayName || "");
  const [quality, setQuality] = useState("studio");
  const [format, setFormat] = useState("wav");
  const [prefs, setPrefs] = useState({
    notifications: true,
    autoExport: false,
    autoChain: true,
    gpu: true,
  });

  // ✅ ADDED useEffect (page mount behavior)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const initials = (user?.displayName || user?.email || "U")
    .split(/[ @.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "U";

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your profile, processing defaults, and workspace preferences."
        actions={
          <Button
            onClick={() => toast.success("Settings saved")}
            className="bg-gradient-primary shadow-glow"
          >
            <Save className="size-4 mr-2" /> Save changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <section className="glass-strong rounded-2xl p-6">
            <h2 className="font-display font-semibold mb-1">Profile</h2>
            <p className="text-sm text-muted-foreground mb-6">
              How you appear inside Sound-Rix.
            </p>

            <div className="flex items-center gap-4 mb-6">
              <Avatar className="size-16">
                {user?.photoURL && (
                  <AvatarImage src={user.photoURL} />
                )}
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="font-medium">
                  {user?.displayName || "Unnamed user"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {user?.email}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dn">Display name</Label>
                <Input
                  id="dn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="em">Email</Label>
                <Input id="em" value={user?.email || ""} disabled />
              </div>
            </div>
          </section>

          {/* Processing Defaults */}
          <section className="glass-strong rounded-2xl p-6">
            <h2 className="font-display font-semibold mb-1">
              Processing Defaults
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Applied to every new job unless overridden.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Quality preset</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast">Fast · Draft</SelectItem>
                    <SelectItem value="balanced">
                      Balanced
                    </SelectItem>
                    <SelectItem value="studio">
                      Studio Master
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Export format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wav">WAV · 24-bit</SelectItem>
                    <SelectItem value="flac">FLAC · Lossless</SelectItem>
                    <SelectItem value="mp3">MP3 · 320kbps</SelectItem>
                    <SelectItem value="m4a">M4A · 256kbps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="glass-strong rounded-2xl p-6">
            <h2 className="font-display font-semibold mb-1">
              Preferences
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Behavior across the workspace.
            </p>

            <div className="divide-y divide-white/10">
              {[
                {
                  id: "notifications",
                  label: "Email notifications",
                  desc: "Get notified when a job completes.",
                },
                {
                  id: "autoExport",
                  label: "Auto-export on complete",
                  desc: "Save processed files to your default folder.",
                },
                {
                  id: "autoChain",
                  label: "Smart Chain by default",
                  desc: "Use intelligent processing for new uploads.",
                },
                {
                  id: "gpu",
                  label: "GPU acceleration",
                  desc: "Faster processing on supported hardware.",
                },
              ].map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-3.5"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {p.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.desc}
                    </div>
                  </div>

                  <Switch
                    checked={
                      (prefs as Record<string, boolean>)[p.id]
                    }
                    onCheckedChange={(v) =>
                      setPrefs((s) => ({
                        ...s,
                        [p.id]: v,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Plan */}
          <section className="glass-strong rounded-2xl p-6">
            <h2 className="font-display font-semibold mb-1">
              Plan
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Sound-Rix Pro
            </p>

            <div className="rounded-xl bg-gradient-primary p-4 text-primary-foreground shadow-glow">
              <div className="text-xs uppercase tracking-wider opacity-80">
                Current plan
              </div>
              <div className="font-display text-2xl font-bold mt-1">
                Pro
              </div>
              <div className="text-xs opacity-80 mt-1">
                Unlimited AI processing · Priority queue
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 bg-white/5 border-white/15"
            >
              Manage subscription
            </Button>
          </section>

          {/* Danger zone */}
          <section className="glass-strong rounded-2xl p-6 border border-destructive/20">
            <h2 className="font-display font-semibold mb-1 text-destructive">
              Danger zone
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Irreversible account actions.
            </p>

            <Button
              variant="outline"
              onClick={() => logout()}
              className="w-full bg-white/5 border-white/15"
            >
              Sign out everywhere
            </Button>

            <Button variant="destructive" className="w-full mt-2">
              <Trash2 className="size-4 mr-2" />
              Delete account
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}