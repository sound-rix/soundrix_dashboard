import { type ReactNode } from "react";

interface Props {
  eyebrow: string;
  title: ReactNode;
  description: string;
  actions?: ReactNode;
}

export default function PageHeader({ eyebrow, title, description, actions }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-primary/80 font-medium mb-2">
          {eyebrow}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-gradient">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}