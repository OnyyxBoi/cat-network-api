import { Router } from "express";
import type { Request, Response } from "express";
import { uuidv4 } from "../utils/generateID.js";
import { getUser } from "../db/users.js";
interface User {
  id: number;
  name: string;
  pseudonym: string;
  email: string;
}
export const commentsRouter = Router();

export function initComments(commentsCollection: any) {
  //create comment
  commentsRouter.post("/", async (req: Request, res: Response) => {
    const comment = req.body;
    comment._id = comment._id || uuidv4();
    comment.createdAt = new Date();
    const user = await getUser(comment.userId);

    comment.user = {
      id: user.id,
      name: user.name,
      pseudonym: user.pseudonym,
      email: user.email,
    };

    try {
      const result = await commentsCollection.insertOne(comment);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // get akk
  commentsRouter.get("/", async (_req: Request, res: Response) => {
    try {
      const comments = await commentsCollection.find({}).toArray();
      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // get by id
  commentsRouter.get("/:id", async (req: Request, res: Response) => {
    try {
      const comment = await commentsCollection.findOne({ _id: req.params.id });
      if (!comment) return res.status(404).json({ error: "Comment not found" });
      res.json(comment);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // updatee comment
  commentsRouter.put("/:id", async (req: Request, res: Response) => {
    try {
      const update = { ...req.body };
      const result = await commentsCollection.updateOne(
        { _id: req.params.id },
        { $set: update }
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // delete comment
  commentsRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
      const result = await commentsCollection.deleteOne({ _id: req.params.id });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  return commentsRouter;
}
