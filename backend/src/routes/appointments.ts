import { Router } from "express";
import * as Appointments from "../db/appointments.js";
import { asyncHandler, getPagination, parseId } from "./utils.js";

const r = Router();

// GET /api/appointments/vets/:vetId/busy-days
r.get(
  "/vets/:vetId/busy-days",
  asyncHandler(async (req, res) => {
    const vetId = parseId(req.params.vetId);
    const minAppts = req.query.minAppts ? Number(req.query.minAppts) : 2;
    const rows = await Appointments.getVetBusyDays(vetId, minAppts);
    res.json(rows);
  })
);

// GET /api/appointments
r.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit, offset } = getPagination(req.query);
    res.json(await Appointments.listAppointments(limit, offset));
  })
);

// GET /api/appointments/:id
r.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const a = await Appointments.getAppointment(parseId(req.params.id));
    return a ? res.json(a) : res.sendStatus(404);
  })
);

// POST /api/appointments
r.post(
  "/",
  asyncHandler(async (req, res) => {
    const created = await Appointments.createAppointment({
      cat: req.body.cat,
      veterinarian: req.body.veterinarian,
      date: new Date(req.body.date),
    });
    res.status(201).json(created);
  })
);

// PATCH /api/appointments/:id
r.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const patch: any = { ...req.body };
    if (patch.date) patch.date = new Date(patch.date);
    const updated = await Appointments.updateAppointment(parseId(req.params.id), patch);
    return updated ? res.json(updated) : res.sendStatus(404);
  })
);

// DELETE /api/appointments/:id
r.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Appointments.deleteAppointment(parseId(req.params.id));
    return deleted ? res.json(deleted) : res.sendStatus(404);
  })
);

// GET /api/appointments/cat/:catId
r.get(
  "/cat/:catId",
  asyncHandler(async (req, res) => {
    const catId = parseId(req.params.catId);
    const { limit, offset } = getPagination(req.query);
    res.json(await Appointments.listAppointmentsForCat(catId, limit, offset));
  })
);

// GET /api/appointments/vet/:vetId
r.get(
  "/vet/:vetId",
  asyncHandler(async (req, res) => {
    const vetId = parseId(req.params.vetId);
    const { limit, offset } = getPagination(req.query);
    res.json(await Appointments.listAppointmentsForVet(vetId, limit, offset));
  })
);

export default r;
