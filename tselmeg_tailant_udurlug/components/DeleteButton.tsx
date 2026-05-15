"use client";

export function DeleteButton({ label = "Устгах" }: { label?: string }) {
  return (
    <button
      className="text-sm font-semibold text-brand-red"
      onClick={(event) => {
        if (!window.confirm("Та устгахдаа итгэлтэй байна уу?")) event.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
