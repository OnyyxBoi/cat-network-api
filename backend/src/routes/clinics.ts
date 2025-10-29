import { Router } from "express";
import * as Clinics from "../db/clinics.js";
import { asyncHandler, getPagination, parseId } from "./utils.js";

const r = Router();

// GET /api/clinics
r.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req.query);
    res.json(await Clinics.listClinics(limit, offset));
  })
);

// GET /api/clinics/:id
r.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const c = await Clinics.getClinic(parseId(req.params.id));
    return c ? res.json(c) : res.sendStatus(404);
  })
);

// POST /api/clinics
r.post(
  "/",
  asyncHandler(async (req, res) => {
    const created = await Clinics.createClinic(req.body);
    res.status(201).json(created);
  })
);

// PATCH /api/clinics/:id
r.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const updated = await Clinics.updateClinic(parseId(req.params.id), req.body);
    return updated ? res.json(updated) : res.sendStatus(404);
  })
);

// DELETE /api/clinics/:id
r.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Clinics.deleteClinic(parseId(req.params.id));
    return deleted ? res.json(deleted) : res.sendStatus(404);
  })
);

// GET /api/clinics/:id/vets
r.get(
  "/:id/vets",
  asyncHandler(async (req, res) => {
    const clinicId = parseId(req.params.id);
    res.json(await Clinics.listClinicVets(clinicId));
  })
);

// POST /api/clinics/:id/vets/:vetId
r.post(
  "/:id/vets/:vetId",
  asyncHandler(async (req, res) => {
    const clinicId = parseId(req.params.id);
    const vetId = parseId(req.params.vetId);
    const link = await Clinics.addVetToClinic(clinicId, vetId);
    res.status(201).json(link);
  })
);

// DELETE /api/clinics/:id/vets/:vetId
r.delete(
  "/:id/vets/:vetId",
  asyncHandler(async (req, res) => {
    const clinicId = parseId(req.params.id);
    const vetId = parseId(req.params.vetId);
    const removed = await Clinics.removeVetFromClinic(clinicId, vetId);
    return removed ? res.json(removed) : res.sendStatus(404);
  })
);

export default r;
