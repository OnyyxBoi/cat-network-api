export function buildUpdate<T extends Record<string, any>>(
  patch: T,
  startIndex = 1
) {
  const keys = Object.keys(patch).filter((k) => patch[k] !== undefined);
  if (keys.length === 0) return { set: "", values: [] as any[] };

  const set = keys.map((k, i) => `"${k}" = $${startIndex + i}`).join(", ");
  const values = keys.map((k) => patch[k]);
  return { set, values, keys };
}
