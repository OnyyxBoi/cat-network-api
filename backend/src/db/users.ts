import { one, query } from "./pg.js";
import type { User, OwnerWithoutCats } from "./types.js";
import { buildUpdate } from "./sql.js";

export async function createUser(data: Omit<User, "id" | "created_at">): Promise<User> {
  const rows = await query<User>(
    `INSERT INTO users (name, first_name, pseudonym, age, email, password, is_owner, is_veterinarian)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      data.name, data.first_name, data.pseudonym, data.age ?? null,
      data.email, data.password, data.is_owner ?? false, data.is_veterinarian ?? false
    ]
  );
  return rows[0];
}

export async function getUser(id: number) {
  return await one<User>(`SELECT * FROM users WHERE id = $1`, [id]);
}

export async function listUsers(limit = 50, offset = 0) {
  return await query<User>(`SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2`, [limit, offset]);
}

export async function updateUser(id: number, patch: Partial<Omit<User, "id" | "created_at">>) {
  const { set, values } = buildUpdate(patch);
  if (!set) return await getUser(id);
  const rows = await query<User>(
    `UPDATE users SET ${set} WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id]
  );
  return rows[0] ?? null;
}

export async function deleteUser(id: number) {
  const rows = await query<User>(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
  return rows[0] ?? null;
}

export async function listOwnersWithoutCats() {
  return await query<OwnerWithoutCats>(
    `
    SELECT u.id AS owner_id, u.pseudonym
    FROM users u
    WHERE u.is_owner = FALSE
      AND NOT EXISTS (
        SELECT 1 FROM cats c WHERE c.owner = u.id
      )
    ORDER BY u.id
    `
  );
}
