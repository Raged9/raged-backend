import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import projectsRouter from "./routes/projects";
import typingScoresRouter from "./routes/typingScores";
import adminRouter from "./routes/admin";
import contactRouter from "./routes/contact";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// Middlewares
app.use(
  cors({
    origin: [CORS_ORIGIN, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const elapsed = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${elapsed}ms)`);
  });
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "edgar-portfolio-backend", uptime: process.uptime() });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "edgar-portfolio-backend", uptime: process.uptime() });
});

// Mount Routes
app.use("/api/projects", projectsRouter);
app.use("/api/typing-scores", typingScoresRouter);
app.use("/api/admin", adminRouter);
app.use("/api/contact", contactRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[API Error]", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Edgar Portfolio Backend Server is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛡️ CORS Allowed: ${CORS_ORIGIN}`);
  console.log(`===============================================`);
});

export default app;
