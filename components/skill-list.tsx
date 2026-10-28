export function SkillList({ skills, className = "" }: { skills: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Skills used">
      {skills.map((s) => (
        <li key={s} className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/80">
          {s}
        </li>
      ))}
    </ul>
  );
}
