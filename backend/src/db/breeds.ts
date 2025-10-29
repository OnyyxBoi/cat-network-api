import { one, query } from "./pg.js";
import type { Breed } from "./types.js";
import { buildUpdate } from "./sql.js";

export async function createBreed(name: string) {
  const rows = await query<Breed>(`INSERT INTO breeds (name) VALUES ($1) RETURNING *`, [name]);
  return rows[0];
}

export async function getBreed(id: number) {
  return await one<Breed>(`SELECT * FROM breeds WHERE id = $1`, [id]);
}

export async function listBreeds(limit = 100, offset = 0) {
  return await query<Breed>(`SELECT * FROM breeds ORDER BY name LIMIT $1 OFFSET $2`, [limit, offset]);
}

export async function updateBreed(id: number, patch: Partial<Pick<Breed, "name">>) {
  const { set, values } = buildUpdate(patch);
  if (!set) return await getBreed(id);
  const rows = await query<Breed>(`UPDATE breeds SET ${set} WHERE id = $${values.length + 1} RETURNING *`, [...values, id]);
  return rows[0] ?? null;
}

export async function deleteBreed(id: number) {
  const rows = await query<Breed>(`DELETE FROM breeds WHERE id = $1 RETURNING *`, [id]);
  return rows[0] ?? null;
}
