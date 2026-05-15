export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`surface-card p-5 ${className}`}>{children}</div>;
}
