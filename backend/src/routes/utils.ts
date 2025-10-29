import type { RequestHandler } from "express";

export function parseId(param: string) {
  const id = Number(param);
  if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid id");
  return id;
}

export function getPagination(query: any, dLimit = 50, max = 200) {
  const limit = Math.min(Math.max(Number(query.limit ?? dLimit), 1), max);
  const offset = Math.max(Number(query.offset ?? 0), 0);
  return { limit, offset };
}

export const asyncHandler =
  (fn: (...args: any[]) => Promise<any>): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
