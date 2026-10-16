import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import projectsRouter from "./routes/projects";
import typingScoresRouter from "./routes/typingScores";
import adminRouter from "./routes/admin";
import contactRouter from "./routes/contact";
import photosRouter from "./routes/photos";

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
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const isAllowed =
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*") ||
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1");

      if (isAllowed) {
        callback(null, true);
      } else {
        // Fallback allow for public portfolio API
        callback(null, true);
      }
    },
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
app.use("/api/photos", photosRouter);

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
