"use server";

import { auth } from "@/auth";
import { database } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateStatus(formData) {
  const session = await auth();
  if (
    !session?.user?.email ||
    session.user.email.toLowerCase() !== process.env.OWNER_EMAIL?.toLowerCase()
  ) {
    throw new Error("Unauthorized");
  }

  const requestId = formData.get("requestId");
  const newStatus = formData.get("status");

  if (!requestId || !newStatus) return;

  const sql = database();
  await sql`
    UPDATE membership_requests
    SET status = ${newStatus}, updated_at = NOW()
    WHERE id = ${requestId}
  `;

  revalidatePath("/admin");
}
