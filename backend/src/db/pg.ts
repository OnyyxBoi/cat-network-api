import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.PGHOST ?? "localhost",
  port: Number(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER ?? "admin",
  password: process.env.PGPASSWORD ?? "password",
  database: process.env.PGDATABASE ?? "cat_network_db",
});

pool.on("connect", async (client) => {
  await client.query('SET search_path TO cat_network, public');
});

export async function query<T = any>(text: string, params?: any[]) {
  const res = await pool.query<T>(text, params);
  return res.rows;
}

export async function one<T = any>(text: string, params?: any[]) {
  const res = await pool.query<T>(text, params);
  return res.rows[0] ?? null;
}
