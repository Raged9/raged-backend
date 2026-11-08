import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectsRouter from "./routes/projects";
import typingScoresRouter from "./routes/typingScores";
import adminRouter from "./routes/admin";
import contactRouter from "./routes/contact";
import photosRouter from "./routes/photos";
import profileRouter from "./routes/profile";
import { db } from "./db/dataStore";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// Middlewares
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed =
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*") ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".workers.dev") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1");

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Normalize multiple slashes in URL path
app.use((req, res, next) => {
  if (req.url && req.url.includes("//")) {
    req.url = req.url.replace(/\/+/g, "/");
  }
  next();
});

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const elapsed = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${elapsed}ms)`);
  });
  next();
});

// Health check endpoints
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "edgar-portfolio-backend",
    storage: db.getStorageMode(),
    uptime: process.uptime(),
  });
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "edgar-portfolio-backend",
    storage: db.getStorageMode(),
    uptime: process.uptime(),
  });
});

// Mount Routes
app.use("/api/projects", projectsRouter);
app.use("/api/typing-scores", typingScoresRouter);
app.use("/api/admin", adminRouter);
app.use("/api/contact", contactRouter);
app.use("/api/photos", photosRouter);
app.use("/api/profile", profileRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[API Error]", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Initialize Database (PostgreSQL if DATABASE_URL is set) and Start Server
db.init().finally(() => {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Edgar Portfolio Backend Server is running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🗄️ Storage Mode: ${db.getStorageMode()}`);
    console.log(`🛡️ CORS Allowed: ${CORS_ORIGIN}`);
    console.log(`===============================================`);
  });
});

export default app;
