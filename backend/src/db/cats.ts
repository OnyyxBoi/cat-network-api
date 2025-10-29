import { one, query } from "./pg.js";
import type { Cat, CatWithOwnerBreed } from "./types.js";
import { buildUpdate } from "./sql.js";

export async function createCat(data: Omit<Cat, "id" | "created_at">) {
  const rows = await query<Cat>(
    `INSERT INTO cats (name, breed, owner, age, weight, main_clinic)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [data.name, data.breed ?? null, data.owner, data.age ?? null, data.weight ?? null, data.main_clinic ?? null]
  );    
  return rows[0];
}

export async function getCat(id: number) {
  return await one<Cat>(`SELECT * FROM cats WHERE id = $1`, [id]);
}

export async function listCats(limit = 50, offset = 0) {
  return await query<Cat>(`SELECT * FROM cats ORDER BY id LIMIT $1 OFFSET $2`, [limit, offset]);
}

export async function updateCat(id: number, patch: Partial<Omit<Cat, "id" | "created_at">>) {
  const { set, values } = buildUpdate(patch);
  if (!set) return await getCat(id);
  const rows = await query<Cat>(`UPDATE cats SET ${set} WHERE id = $${values.length + 1} RETURNING *`, [...values, id]);
  return rows[0] ?? null;
}

export async function deleteCat(id: number) {
  const rows = await query<Cat>(`DELETE FROM cats WHERE id = $1 RETURNING *`, [id]);
  return rows[0] ?? null;
}

export async function listCatsByOwner(ownerId: number, limit = 50, offset = 0) {
  return await query<Cat>(
    `SELECT * FROM cats WHERE owner = $1 ORDER BY id LIMIT $2 OFFSET $3`,
    [ownerId, limit, offset]
  );
}

export async function listCatsWithOwnerAndBreed(limit = 50, offset = 0) {
  return await query<CatWithOwnerBreed>(
    `
    SELECT c.id,
           c.name AS cat_name,
           u.id   AS owner_id,
           u.pseudonym AS owner_pseudonym,
           b.name AS breed_name
    FROM cats c
    JOIN users u ON u.id = c.owner
    LEFT JOIN breeds b ON b.id = c.breed
    ORDER BY c.id
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
}
