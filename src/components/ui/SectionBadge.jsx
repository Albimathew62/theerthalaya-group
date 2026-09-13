export default function SectionBadge({ children, className = '' }) {
  return (
    <span
      className={`inline-block text-[11px] font-medium tracking-[0.28em] uppercase text-brass ${className}`}
    >
      {children}
    </span>
  );
}
