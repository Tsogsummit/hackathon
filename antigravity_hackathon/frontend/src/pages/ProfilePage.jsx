import { useAuthStore } from "../store/authStore.js";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="es-section" style={{ maxWidth: 720 }}>
      <h1 className="es-page-title">Профайл</h1>
      <p className="es-page-desc">Таны бүртгэлийн үндсэн мэдээлэл.</p>

      <div className="es-card" style={{ marginTop: 12 }}>
        <div style={{ display: "grid", gap: 10 }}>
          <div><strong>Нэр:</strong> {user?.full_name || "-"}</div>
          <div><strong>И-мэйл:</strong> {user?.email || "-"}</div>
          <div><strong>Role:</strong> {user?.role || "-"}</div>
        </div>
      </div>
    </div>
  );
}
