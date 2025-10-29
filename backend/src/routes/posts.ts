import { Router } from "express";
import type { Request, Response } from "express";
import { uuidv4 } from "../utils/generateID.js";
export const postsRouter = Router();

export function initPosts(postsCollection: any) {
  // create post
  postsRouter.post("/", async (req: Request, res: Response) => {
    const post = req.body;
    post._id = post._id || uuidv4();

    post.createdAt = new Date();
    post.updatedAt = new Date();
    try {
      const result = await postsCollection.insertOne(post);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // get all posts
  postsRouter.get("/", async (_req: Request, res: Response) => {
    try {
      const posts = await postsCollection.find({}).toArray();
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // get post by id
  postsRouter.get("/:id", async (req: Request, res: Response) => {
    try {
      const post = await postsCollection.findOne({ _id: req.params.id });
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json(post);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // update
  postsRouter.put("/:id", async (req: Request, res: Response) => {
    try {
      const update = { ...req.body, updatedAt: new Date() };
      const result = await postsCollection.updateOne(
        { _id: req.params.id },
        { $set: update }
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // delete
  postsRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
      const result = await postsCollection.deleteOne({ _id: req.params.id });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  return postsRouter;
}
