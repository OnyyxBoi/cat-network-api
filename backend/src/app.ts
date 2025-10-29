import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import { MongoClient } from "mongodb";
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

async function startServer() {
  try {
    await client.connect();
    const db = client.db("socialdb");

    const postsCollection = db.collection("posts");
    const commentsCollection = db.collection("comments");
    const reactionsCollection = db.collection("reactions");

    // Passe **toutes les collections** à initPosts
    app.use(
      "/api/posts",
      initPosts(postsCollection, commentsCollection, reactionsCollection)
    );

    app.use("/api/comments", initComments(commentsCollection));
    app.use("/api/reactions", initReactions(reactionsCollection));

    // Health check
    app.get("/api/health", (_req: Request, res: Response) => {
      res.json({ ok: true, service: "backend", time: new Date().toISOString() });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

startServer();
