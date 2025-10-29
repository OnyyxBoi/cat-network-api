import { Router } from "express";
import * as Users from "../db/users.js";
import { asyncHandler, getPagination, parseId } from "./utils.js";

const r = Router();

// GET /api/users/without-cats
r.get(
  "/without-cats",
  asyncHandler(async (_req, res) => {
    const rows = await Users.listOwnersWithoutCats();
    res.json(rows);
  })
);

// GET /api/users
r.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req.query);
    res.json(await Users.listUsers(limit, offset));
  })
);

// GET /api/users/:id
r.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await Users.getUser(parseId(req.params.id));
    return user ? res.json(user) : res.sendStatus(404);
  })
);

// POST /api/users
r.post(
  "/",
  asyncHandler(async (req, res) => {
    const created = await Users.createUser(req.body);
    res.status(201).json(created);
  })
);

// PATCH /api/users/:id
r.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const updated = await Users.updateUser(parseId(req.params.id), req.body);
    return updated ? res.json(updated) : res.sendStatus(404);
  })
);

// DELETE /api/users/:id
r.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Users.deleteUser(parseId(req.params.id));
    return deleted ? res.json(deleted) : res.sendStatus(404);
  })
);

export default r;
