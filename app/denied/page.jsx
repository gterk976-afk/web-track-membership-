import Link from "next/link";

export default function DeniedPage() {
  return (
    <main>
      <section className="card">
        <div className="tag" style={{ color: "#ea4335" }}>ACCESS DENIED</div>
        <h1>غير مصرح لك بالدخول</h1>
        <p>هذه الصفحة مخصصة لمالك الموقع فقط لإدارة الطلبات.</p>
        <Link className="button primary" href="/dashboard">
          العودة للرئيسية
        </Link>
      </section>
    </main>
  );
}
