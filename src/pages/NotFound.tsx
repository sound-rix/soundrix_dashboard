import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-background bg-aurora">
      <div className="text-center glass-strong rounded-2xl p-10 max-w-md mx-4">
        <div className="font-display text-7xl font-bold text-gradient">404</div>
        <p className="text-muted-foreground mt-2 mb-6">
          The page you're looking for drifted into the noise floor.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}