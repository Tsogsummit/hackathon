export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-brand-line bg-white px-3 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 ${props.className || ""}`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-28 w-full rounded-lg border border-brand-line bg-white px-3 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 ${props.className || ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-brand-line bg-white px-3 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 ${props.className || ""}`}
    />
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-black text-brand-navy">{children}</label>;
}

export function SubmitButton({ children = "Хадгалах" }: { children?: React.ReactNode }) {
  return <button className="brand-button px-5 py-3 font-black transition">{children}</button>;
}
