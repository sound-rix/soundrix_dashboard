import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const { loginEmail, loginGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await loginEmail(email, password);

      toast.success("Signed in successfully");

      navigate("/");
    } catch (err) {
      console.error(err);

      toast.error(
        err instanceof Error ? err.message : "Failed to sign in"
      );
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setGLoading(true);

    try {
      await loginGoogle();

      toast.success("Google sign-in successful");

      navigate("/");
    } catch (err) {
      console.error("Google Login Error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Google sign-in failed"
      );
    } finally {
      setGLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Sound-Rix workspace"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-primary hover:opacity-95 shadow-glow h-11"
        >
          {loading && (
            <Loader2 className="size-4 animate-spin mr-2" />
          )}

          Sign in
        </Button>
      </form>

      <Divider />

      <Button
        type="button"
        variant="outline"
        onClick={onGoogle}
        disabled={gLoading}
        className="w-full h-11 bg-white/5 border-white/15 hover:bg-white/10"
      >
        {gLoading ? (
          <Loader2 className="size-4 animate-spin mr-2" />
        ) : (
          <GoogleIcon />
        )}

        Continue with Google
      </Button>

      <p className="text-sm text-muted-foreground text-center mt-6">
        No account?{" "}
        <Link
          to="/signup"
          className="text-primary hover:underline font-medium"
        >
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}

/* ================= AUTH SHELL ================= */

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute inset-0 bg-aurora opacity-90"
      />

      <div
        aria-hidden
        className="absolute -top-32 -left-32 size-[500px] rounded-full bg-primary/20 blur-3xl animate-float"
      />

      <div
        aria-hidden
        className="absolute -bottom-40 -right-20 size-[500px] rounded-full bg-[#6f4bd6]/20 blur-3xl animate-float"
      />

      <div className="relative w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <img
            src="/logo.png"
            alt="Sound-Rix Logo"
            className="h-14 w-auto object-contain"
          />
        </div>

        <div className="glass-strong rounded-2xl p-8 shadow-card">
          <h1 className="font-display text-2xl font-bold text-gradient">
            {title}
          </h1>

          <p className="text-sm text-muted-foreground mt-1 mb-6">
            {subtitle}
          </p>

          {children}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          © {new Date().getFullYear()} Sound-Rix · AI Audio Intelligence
        </p>
      </div>
    </div>
  );
}

/* ================= DIVIDER ================= */

export function Divider() {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-white/10" />
      </div>

      <div className="relative flex justify-center text-xs uppercase tracking-wider">
        <span className="bg-card px-2 text-muted-foreground rounded">
          or
        </span>
      </div>
    </div>
  );
}

/* ================= GOOGLE ICON ================= */

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-4 mr-2" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 5.9 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />

      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 7.9 29.4 6 24 6 16.1 6 9.3 10.4 6.3 14.7z"
      />

      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.4 35 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.2 39.5 16 44 24 44z"
      />

      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5l6.3 5.3C41.6 35.9 44 30.4 44 24c0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}