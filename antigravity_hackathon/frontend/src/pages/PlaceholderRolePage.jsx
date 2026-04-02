import { useAuthStore } from "../store/authStore.js";

export default function PlaceholderRolePage({ title, description }) {
  const user = useAuthStore((s) => s.user);
  return (
    <div>
      <h1 className="es-page-title">{title}</h1>
      <p className="es-page-desc">{description}</p>
      <div className="es-card">
        <p>
          Таны эрх: <strong>{user?.role}</strong>
        </p>
        <p style={{ color: "var(--es-muted)" }}>Энэ модуль удахгүй нэмэгдэнэ.</p>
      </div>
    </div>
  );
}
