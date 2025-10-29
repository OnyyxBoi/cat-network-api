import { Router } from "express";
import type { Request, Response } from "express";
import { uuidv4 } from "../utils/generateID.js";

export const reactionsRouter = Router();

export function initReactions(reactionsCollection: any) {
  reactionsRouter.post("/", async (req: Request, res: Response) => {
    const reaction = req.body;
    reaction._id = reaction._id || uuidv4();
    reaction.createdAt = new Date();

    try {
      const result = await reactionsCollection.insertOne(reaction);
      res.status(201).json(result);
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(400).json({ error: "Duplicate reaction", details: err });
      }
      res.status(500).json({ error: err });
    }
  });

  // get all
  reactionsRouter.get("/", async (_req: Request, res: Response) => {
    try {
      const reactions = await reactionsCollection.find({}).toArray();
      res.json(reactions);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // get by id
  reactionsRouter.get("/:id", async (req: Request, res: Response) => {
    try {
      const reaction = await reactionsCollection.findOne({ _id: req.params.id });
      if (!reaction) return res.status(404).json({ error: "Reaction not found" });
      res.json(reaction);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // update reaction
  reactionsRouter.put("/:id", async (req: Request, res: Response) => {
    try {
      const update = { ...req.body, createdAt: new Date() };
      const result = await reactionsCollection.updateOne(
        { _id: req.params.id },
        { $set: update }
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // delete reaction
  reactionsRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
      const result = await reactionsCollection.deleteOne({ _id: req.params.id });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  return reactionsRouter;
}
