import { Router, Request, Response, NextFunction } from "express";
import { db } from "../db/dataStore";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// GET /api/photos - list all off-screen photos
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const photos = await db.getPhotos();
    res.json(photos);
  } catch (err) {
    next(err);
  }
});

// GET /api/photos/:id - get photo by ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const photo = await db.getPhotoById(req.params.id);
    if (!photo) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }
    res.json(photo);
  } catch (err) {
    next(err);
  }
});

// PUT /api/photos - bulk update photos (Admin only)
router.put("/", authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { photos } = req.body;
    if (!Array.isArray(photos)) {
      res.status(400).json({ error: "Array of photos is required" });
      return;
    }
    const updated = await db.updateAllPhotos(photos);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/photos - create photo (Admin only)
router.post("/", authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { caption, imageUrl, order, rotation } = req.body;
    const newPhoto = await db.createPhoto({
      caption: caption || "polaroid memory",
      imageUrl: imageUrl || "",
      order: typeof order === "number" ? order : 99,
      rotation: typeof rotation === "number" ? rotation : 0,
    });
    res.status(201).json(newPhoto);
  } catch (err) {
    next(err);
  }
});

// PUT /api/photos/:id - update single photo (Admin only)
router.put("/:id", authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await db.updatePhoto(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/photos/:id - delete photo (Admin only)
router.delete(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const success = await db.deletePhoto(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Photo not found" });
        return;
      }
      res.json({ success: true, message: "Photo deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
