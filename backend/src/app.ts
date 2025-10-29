import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import { initPosts } from "./routes/posts.js";
import { initComments } from "./routes/comments.js";
import { initReactions } from "./routes/reactions.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// mongodb
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(mongoUri);
let postsCollection: any;

async function connectMongo() {
  await client.connect();
  const db = client.db("socialdb");

  //posts
  postsCollection = db.collection("posts");
  const postsRouter = initPosts(postsCollection);
  app.use("/api/posts", postsRouter);

  //commetns
  const commentsCollection = db.collection("comments");
  const commentsRouter = initComments(commentsCollection);
  app.use("/api/comments", commentsRouter);

  //reactions
  const reactionsCollection = db.collection("reactions");
  const reactionsRouter = initReactions(reactionsCollection);
  app.use("/api/reactions", reactionsRouter);
}
connectMongo().catch(console.error);


// Health check route
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "backend", time: new Date().toISOString() });
});

// Example route
// app.get("/api/hello", (_req: Request, res: Response) => {
//   res.json({ message: "Meow from Express 🐾" });
// });


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
