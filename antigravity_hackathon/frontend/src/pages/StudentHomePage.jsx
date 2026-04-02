import { Link } from "react-router-dom";

export default function StudentHomePage() {
  return (
    <div>
      <h1 className="es-page-title">Сурагчийн хэсэг</h1>
      <p className="es-page-desc">Өөрийн дүнгийн таамаг, эрсдэл, мэдэгдлийг эндээс хянана.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
        <Link to="/student/grade-predictions" className="es-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>📊</div>
          <strong>Миний улирлын оноо ба таамаг</strong>
          <p style={{ margin: "8px 0 0", color: "var(--es-muted)" }}>Гэрийн даалгавар, шалгалт, бие даалт, ирц дээр үндэслэсэн таамаг.</p>
        </Link>
        <Link to="/student/event-report" className="es-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>🚨</div>
          <strong>Сургуулийн зөрчил мэдэгдэх</strong>
          <p style={{ margin: "8px 0 0", color: "var(--es-muted)" }}>Bully, smoke, vape зэрэг асуудлыг мэдэгдэнэ.</p>
        </Link>
        <Link to="/student/timetable" className="es-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>🗓️</div>
          <strong>Миний хичээлийн хуваарь</strong>
          <p style={{ margin: "8px 0 0", color: "var(--es-muted)" }}>Долоо хоногийн өдөр, цаг, хичээл бүрээр харах.</p>
        </Link>
        <Link to="/academic-breakdown" className="es-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>🧾</div>
          <strong>Хичээл тус бүрийн дэлгэрэнгүй</strong>
          <p style={{ margin: "8px 0 0", color: "var(--es-muted)" }}>Даалгавар, бие даалт, midterm, final, ирц, нэмэлт оноо тусдаа.</p>
        </Link>
      </div>
    </div>
  );
}
