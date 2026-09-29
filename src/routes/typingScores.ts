import { Router, Request, Response } from "express";
import { db } from "../db/dataStore";

const router = Router();

// GET /api/typing-scores/leaderboard - top scores
router.get("/leaderboard", (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const leaderboard = db.getLeaderboard(limit);
  res.json(leaderboard);
});

// POST /api/typing-scores - submit typing score
router.post("/", (req: Request, res: Response) => {
  const { playerName, wpm, accuracy } = req.body;

  if (!playerName || typeof wpm !== "number" || typeof accuracy !== "number") {
    res.status(400).json({ error: "Missing required score fields: playerName, wpm, accuracy" });
    return;
  }

  const score = db.addScore({
    playerName: String(playerName).trim().slice(0, 24),
    wpm: Math.round(wpm),
    accuracy: Math.round(accuracy * 10) / 10,
  });

  res.status(201).json(score);
});

export default router;
