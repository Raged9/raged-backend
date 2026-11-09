import { Router, Request, Response } from "express";
import { db } from "../db/dataStore";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// GET /api/hangline (Public)
router.get("/", async (req: Request, res: Response) => {
  try {
    const items = await db.getHanglineItems();
    res.json(items);
  } catch (err) {
    console.error("[Hangline GET Error]", err);
    res.status(500).json({ error: "Failed to fetch hangline items" });
  }
});

// POST /api/hangline (Authenticated Admin)
router.post("/", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const created = await db.createHanglineItem(req.body || {});
    res.status(201).json(created);
  } catch (err) {
    console.error("[Hangline POST Error]", err);
    res.status(500).json({ error: "Failed to create hangline item" });
  }
});

// PUT /api/hangline/:id (Authenticated Admin)
router.put("/:id", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await db.updateHanglineItem(id, req.body || {});
    if (!updated) {
      res.status(404).json({ error: "Hangline item not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    console.error("[Hangline PUT Error]", err);
    res.status(500).json({ error: "Failed to update hangline item" });
  }
});

// DELETE /api/hangline/:id (Authenticated Admin)
router.delete("/:id", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await db.deleteHanglineItem(id);
    if (!deleted) {
      res.status(404).json({ error: "Hangline item not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    console.error("[Hangline DELETE Error]", err);
    res.status(500).json({ error: "Failed to delete hangline item" });
  }
});

export default router;
