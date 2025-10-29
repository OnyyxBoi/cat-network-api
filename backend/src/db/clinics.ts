import { one, query } from "./pg.js";
import type { Clinic, ClinicVeterinarian } from "./types.js";
import { buildUpdate } from "./sql.js";

export async function createClinic(data: Omit<Clinic, "id" | "created_at">) {
  const rows = await query<Clinic>(
    `INSERT INTO clinics (name, address) VALUES ($1,$2) RETURNING *`,
    [data.name, data.address]
  );
  return rows[0];
}

export async function getClinic(id: number) {
  return await one<Clinic>(`SELECT * FROM clinics WHERE id = $1`, [id]);
}

export async function listClinics(limit = 50, offset = 0) {
  return await query<Clinic>(`SELECT * FROM clinics ORDER BY id LIMIT $1 OFFSET $2`, [limit, offset]);
}

export async function updateClinic(id: number, patch: Partial<Omit<Clinic, "id" | "created_at">>) {
  const { set, values } = buildUpdate(patch);
  if (!set) return await getClinic(id);
  const rows = await query<Clinic>(`UPDATE clinics SET ${set} WHERE id = $${values.length + 1} RETURNING *`, [...values, id]);
  return rows[0] ?? null;
}

export async function deleteClinic(id: number) {
  const rows = await query<Clinic>(`DELETE FROM clinics WHERE id = $1 RETURNING *`, [id]);
  return rows[0] ?? null;
}

export async function addVetToClinic(clinic_id: number, vet_id: number) {
  const rows = await query<ClinicVeterinarian>(
    `INSERT INTO clinic_veterinarians (clinic_id, vet_id) VALUES ($1,$2) ON CONFLICT DO NOTHING RETURNING *`,
    [clinic_id, vet_id]
  );
  return rows[0] ?? { clinic_id, vet_id };
}

export async function removeVetFromClinic(clinic_id: number, vet_id: number) {
  const rows = await query<ClinicVeterinarian>(
    `DELETE FROM clinic_veterinarians WHERE clinic_id=$1 AND vet_id=$2 RETURNING *`,
    [clinic_id, vet_id]
  );
  return rows[0] ?? null;
}

export async function listClinicVets(clinic_id: number) {
  return await query<{ vet_id: number }>(
    `SELECT vet_id FROM clinic_veterinarians WHERE clinic_id = $1 ORDER BY vet_id`,
    [clinic_id]
  );
}
