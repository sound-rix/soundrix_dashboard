import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";

import { AuthShell, Divider, GoogleIcon } from "./Login";

export default function Signup() {
  const { signupEmail, loginGoogle } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [gLoading, setGLoading] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passedChecks =
    Object.values(passwordChecks).filter(Boolean).length;

  const passwordStrength =
    passedChecks <= 2
      ? "Weak"
      : passedChecks <= 4
      ? "Medium"
      : "Strong";

  const isPasswordValid =
    Object.values(passwordChecks).every(Boolean);

  const passwordsMatch =
    password.length > 0 &&
    password === confirmPassword;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Please create a stronger password");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signupEmail(name, email, password);

      toast.success("Account created successfully");

      navigate("/");
    } catch (err) {
      console.error(err);

      toast.error(
        err instanceof Error ? err.message : "Sign-up failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setGLoading(true);

    try {
      await loginGoogle();

      toast.success("Google sign-up successful");

      navigate("/");
    } catch (err) {
      console.error("Google Signup Error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Google sign-in failed"
      );
    } finally {
      setGLoading(false);
    }
  };

  const Rule = ({
    valid,
    text,
  }: {
    valid: boolean;
    text: string;
  }) => (
    <div
      className={`flex items-center gap-2 text-xs ${
        valid ? "text-green-500" : "text-muted-foreground"
      }`}
    >
      {valid ? (
        <CheckCircle className="size-3" />
      ) : (
        <XCircle className="size-3" />
      )}

      <span>{text}</span>
    </div>
  );

  return (
    <AuthShell
      title="Create your studio"
      subtitle="Start enhancing audio with AI in minutes"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            autoComplete="name"
          />
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Create strong password"
              autoComplete="new-password"
              className="pr-10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Password Strength</span>

              <span
                className={
                  passwordStrength === "Strong"
                    ? "text-green-500"
                    : passwordStrength === "Medium"
                    ? "text-yellow-500"
                    : "text-red-500"
                }
              >
                {passwordStrength}
              </span>
            </div>

            <div className="w-full h-2 rounded bg-white/10 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  passwordStrength === "Strong"
                    ? "bg-green-500 w-full"
                    : passwordStrength === "Medium"
                    ? "bg-yellow-500 w-2/3"
                    : "bg-red-500 w-1/3"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <Rule
              valid={passwordChecks.length}
              text="Minimum 8 characters"
            />

            <Rule
              valid={passwordChecks.uppercase}
              text="One uppercase letter"
            />

            <Rule
              valid={passwordChecks.lowercase}
              text="One lowercase letter"
            />

            <Rule
              valid={passwordChecks.number}
              text="One number"
            />

            <Rule
              valid={passwordChecks.special}
              text="One special character"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">
            Confirm Password
          </Label>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={
                showConfirmPassword ? "text" : "password"
              }
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm password"
              autoComplete="new-password"
              className="pr-10"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {confirmPassword.length > 0 && (
            <p
              className={`text-xs ${
                passwordsMatch
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {passwordsMatch
                ? "Passwords match"
                : "Passwords do not match"}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={
            loading ||
            !isPasswordValid ||
            !passwordsMatch
          }
          className="w-full bg-gradient-primary hover:opacity-95 shadow-glow h-11"
        >
          {loading && (
            <Loader2 className="size-4 animate-spin mr-2" />
          )}

          Create account
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
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}