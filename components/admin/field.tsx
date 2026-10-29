import type { ReactNode } from "react";

export const inputClass = "mt-1 w-full rounded-md border border-white/20 bg-black/40 px-3 py-2 text-white focus:border-brand focus:outline-none";

type Props = { id: string; label: string; error?: string; hint?: string; children: ReactNode; className?: string };

/** Label + control + optional error, wired with htmlFor/aria-describedby. */
export function Field({ id, label, error, hint, children, className = "" }: Props) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm text-white/70">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-white/40">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-brand-light">
          {error}
        </p>
      )}
    </div>
  );
}

export const describedBy = (id: string, error?: string) => (error ? `${id}-error` : undefined);
