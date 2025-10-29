import { Router } from "express";
import * as Breeds from "../db/breeds.js";
import { asyncHandler, getPagination, parseId } from "./utils.js";

const r = Router();

// GET /api/breeds
r.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req.query, 100);
    const breeds = await Breeds.listBreeds(limit, offset);
    res.json(breeds);
  })
);

// GET /api/breeds/:id
r.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const breed = await Breeds.getBreed(parseId(req.params.id));
    return breed ? res.json(breed) : res.sendStatus(404);
  })
);

// POST /api/breeds
r.post(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.body.name) return res.status(400).json({ error: "Missing name" });
    const created = await Breeds.createBreed(req.body.name);
    res.status(201).json(created);
  })
);

// PATCH /api/breeds/:id
r.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const updated = await Breeds.updateBreed(parseId(req.params.id), req.body);
    return updated ? res.json(updated) : res.sendStatus(404);
  })
);

// DELETE /api/breeds/:id
r.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Breeds.deleteBreed(parseId(req.params.id));
    return deleted ? res.json(deleted) : res.sendStatus(404);
  })
);

export default r;
