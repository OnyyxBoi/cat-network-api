import { Router } from "express";
import type { Request, Response } from "express";
import { uuidv4 } from "../utils/generateID.js";
import {getPostsAggregated, getPostWithCommentsTree, getTopPostsByReactions, getPopularPosts} from "../mongoPipelines/postsPipelines.js";

export const postsRouter = Router();

export function initPosts(postsCollection: any, commentsCollection: any, reactionsCollection: any) {
  // agregations

  // post comments and reaction count
  postsRouter.get("/aggregated/all", async (_req: Request, res: Response) => {
    try {
      const posts = await getPostsAggregated(
        postsCollection,
        commentsCollection,
        reactionsCollection
      );
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // comments tree post
  postsRouter.get("/tree/:id", async (req: Request, res: Response) => {
    try {
      const post = await getPostWithCommentsTree(
        postsCollection,
        commentsCollection,
        req.params.id
      );
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json(post);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // top x posts par reactions
  postsRouter.get("/top", async (req: Request, res: Response) => {
    try {
      const n = req.query.n ? parseInt(req.query.n as string) : 5;
      const posts = await getTopPostsByReactions(
        postsCollection,
        reactionsCollection,
        n
      );
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // popular posts au moins x reactions
  postsRouter.get("/popular", async (req: Request, res: Response) => {
    try {
      const min = req.query.min ? parseInt(req.query.min as string) : 3;
      const posts = await getPopularPosts(
        postsCollection,
        reactionsCollection,
        min
      );
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  // crud basique

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

  // update post
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

  // delete post
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
