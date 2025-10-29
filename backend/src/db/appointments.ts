import { one, query } from "./pg.js";
import type { Appointment, VetBusyDay } from "./types.js";
import { buildUpdate } from "./sql.js";

export async function createAppointment(data: Omit<Appointment, "id" | "created_at">) {
  const rows = await query<Appointment>(
    `INSERT INTO appointments (cat, veterinarian, "date")
     VALUES ($1,$2,$3)
     RETURNING *`,
    [data.cat, data.veterinarian, data.date]
  );
  return rows[0];
}

export async function getAppointment(id: number) {
  return await one<Appointment>(`SELECT * FROM appointments WHERE id = $1`, [id]);
}

export async function listAppointments(limit = 50, offset = 0) {
  return await query<Appointment>(`SELECT * FROM appointments ORDER BY "date" DESC LIMIT $1 OFFSET $2`, [limit, offset]);
}

export async function listAppointmentsForCat(catId: number, limit = 50, offset = 0) {
  return await query<Appointment>(
    `SELECT * FROM appointments WHERE cat = $1 ORDER BY "date" DESC LIMIT $2 OFFSET $3`,
    [catId, limit, offset]
  );
}

export async function listAppointmentsForVet(vetId: number, limit = 50, offset = 0) {
  return await query<Appointment>(
    `SELECT * FROM appointments WHERE veterinarian = $1 ORDER BY "date" DESC LIMIT $2 OFFSET $3`,
    [vetId, limit, offset]
  );
}

export async function updateAppointment(id: number, patch: Partial<Omit<Appointment, "id" | "created_at">>) {
  const { set, values } = buildUpdate(patch);
  if (!set) return await getAppointment(id);
  const rows = await query<Appointment>(`UPDATE appointments SET ${set} WHERE id = $${values.length + 1} RETURNING *`, [...values, id]);
  return rows[0] ?? null;
}

export async function deleteAppointment(id: number) {
  const rows = await query<Appointment>(`DELETE FROM appointments WHERE id = $1 RETURNING *`, [id]);
  return rows[0] ?? null;
}

export async function getVetBusyDays(vetId: number, minAppts = 2) {
  return await query<VetBusyDay>(
    `
    SELECT v.id AS vet_id,
           v.pseudonym,
           DATE(a.date)::text AS appt_day,
           COUNT(*)::int AS appts
    FROM appointments a
    JOIN users v ON v.id = a.veterinarian
    WHERE v.id = $1
    GROUP BY v.id, v.pseudonym, DATE(a.date)
    HAVING COUNT(*) >= $2
    ORDER BY appt_day DESC, appts DESC
    `,
    [vetId, minAppts]
  );
}
