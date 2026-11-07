import { Router, Request, Response, NextFunction } from "express";
import { db } from "../db/dataStore";

const router = Router();

// GET /api/typing-scores/leaderboard - top scores
router.get("/leaderboard", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const leaderboard = await db.getLeaderboard(limit);
    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
});

// POST /api/typing-scores - submit typing score
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { playerName, wpm, accuracy } = req.body;

    if (!playerName || typeof wpm !== "number" || typeof accuracy !== "number") {
      res.status(400).json({ error: "Missing required score fields: playerName, wpm, accuracy" });
      return;
    }

    const score = await db.addScore({
      playerName: String(playerName).trim().slice(0, 24),
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy * 10) / 10,
    });

    res.status(201).json(score);
  } catch (err) {
    next(err);
  }
});

export default router;
