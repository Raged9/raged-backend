import { Router, Request, Response } from "express";
import { db } from "../db/dataStore";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// GET /api/profile (Public)
router.get("/", async (req: Request, res: Response) => {
  try {
    const profile = await db.getProfile();
    res.json(profile);
  } catch (err) {
    console.error("[Profile GET Error]", err);
    res.status(500).json({ error: "Failed to fetch profile settings" });
  }
});

// PUT /api/profile (Authenticated Admin)
router.put("/", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await db.updateProfile(req.body || {});
    res.json(updated);
  } catch (err) {
    console.error("[Profile PUT Error]", err);
    res.status(500).json({ error: "Failed to update profile settings" });
  }
});

export default router;
