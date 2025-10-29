import { Router } from "express";
import * as Cats from "../db/cats.js";
import { asyncHandler, getPagination, parseId } from "./utils.js";

const r = Router();

// GET /api/cats/with-owner-breed
r.get(
  "/with-owner-breed",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req.query);
    const rows = await Cats.listCatsWithOwnerAndBreed(limit, offset);
    res.json(rows);
  })
);

// GET /api/cats
r.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req.query);
    res.json(await Cats.listCats(limit, offset));
  })
);

// GET /api/cats/:id
r.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const c = await Cats.getCat(parseId(req.params.id));
    return c ? res.json(c) : res.sendStatus(404);
  })
);

// POST /api/cats
r.post(
  "/",
  asyncHandler(async (req, res) => {
    const created = await Cats.createCat(req.body);
    res.status(201).json(created);
  })
);

// PATCH /api/cats/:id
r.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const updated = await Cats.updateCat(parseId(req.params.id), req.body);
    return updated ? res.json(updated) : res.sendStatus(404);
  })
);

// DELETE /api/cats/:id
r.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Cats.deleteCat(parseId(req.params.id));
    return deleted ? res.json(deleted) : res.sendStatus(404);
  })
);

// GET /api/cats/owner/:ownerId
r.get(
  "/owner/:ownerId",
  asyncHandler(async (req, res) => {
    const ownerId = parseId(req.params.ownerId);
    const { limit, offset } = getPagination(req.query);
    res.json(await Cats.listCatsByOwner(ownerId, limit, offset));
  })
);

export default r;
