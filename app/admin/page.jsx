import { auth } from "@/auth";
import { database } from "@/lib/db";
import { redirect } from "next/navigation";
import { updateStatus } from "./actions";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email) redirect("/");
  if (session.user.email.toLowerCase() !== process.env.OWNER_EMAIL?.toLowerCase()) {
    redirect("/denied");
  }

  const sql = database();
  const requests = await sql`
    SELECT id, name, email, status, created_at
    FROM membership_requests
    ORDER BY created_at DESC
  `;

  return (
    <main>
      <section className="card" style={{ maxWidth: "800px" }}>
        <div className="tag">ADMIN PANEL</div>
        <h1>لوحة تحكم الطلبات</h1>
        <p>مرحباً {session.user.name}، إدارة طلبيات العضوية:</p>

        <div className="list">
          {requests.length === 0 ? (
            <p>لا يوجد طلبات حالياً.</p>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="request">
                <div><strong>الاسم:</strong> {req.name || "بدون اسم"}</div>
                <div><strong>البريد:</strong> {req.email}</div>
                <div><strong>الحالة:</strong> <span className="status">{req.status}</span></div>

                <div className="actions">
                  <form action={updateStatus}>
                    <input type="hidden" name="requestId" value={req.id} />
                    <input type="hidden" name="status" value="ACCEPTED" />
                    <button type="submit" className="accept">قبول</button>
                  </form>

                  <form action={updateStatus}>
                    <input type="hidden" name="requestId" value={req.id} />
                    <input type="hidden" name="status" value="REJECTED" />
                    <button type="submit" className="reject">رفض</button>
                  </form>

                  <form action={updateStatus}>
                    <input type="hidden" name="requestId" value={req.id} />
                    <input type="hidden" name="status" value="EXCLUDED" />
                    <button type="submit" className="exclude">استبعاد</button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
