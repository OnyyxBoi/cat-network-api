import express from "express";
import cors from "cors";
import type { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "backend", time: new Date().toISOString() });
});

// Example route
app.get("/api/hello", (_req: Request, res: Response) => {
  res.json({ message: "Meow from Express 🐾" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
