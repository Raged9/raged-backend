import { Router, Request, Response } from "express";
import { db } from "../db/dataStore";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// GET /api/photos - list all off-screen photos
router.get("/", (req: Request, res: Response) => {
  const photos = db.getPhotos();
  res.json(photos);
});

// GET /api/photos/:id - get photo by ID
router.get("/:id", (req: Request, res: Response) => {
  const photo = db.getPhotoById(req.params.id);
  if (!photo) {
    res.status(404).json({ error: "Photo not found" });
    return;
  }
  res.json(photo);
});

// PUT /api/photos - bulk update photos (Admin only)
router.put("/", authenticateAdmin, (req: Request, res: Response) => {
  const { photos } = req.body;
  if (!Array.isArray(photos)) {
    res.status(400).json({ error: "Array of photos is required" });
    return;
  }
  const updated = db.updateAllPhotos(photos);
  res.json(updated);
});

// POST /api/photos - create photo (Admin only)
router.post("/", authenticateAdmin, (req: Request, res: Response) => {
  const { caption, imageUrl, order, rotation } = req.body;
  const newPhoto = db.createPhoto({
    caption: caption || "polaroid memory",
    imageUrl: imageUrl || "",
    order: typeof order === "number" ? order : 99,
    rotation: typeof rotation === "number" ? rotation : 0,
  });
  res.status(201).json(newPhoto);
});

// PUT /api/photos/:id - update single photo (Admin only)
router.put("/:id", authenticateAdmin, (req: Request, res: Response) => {
  const updated = db.updatePhoto(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: "Photo not found" });
    return;
  }
  res.json(updated);
});

// DELETE /api/photos/:id - delete photo (Admin only)
router.delete("/:id", authenticateAdmin, (req: Request, res: Response) => {
  const success = db.deletePhoto(req.params.id);
  if (!success) {
    res.status(404).json({ error: "Photo not found" });
    return;
  }
  res.json({ success: true, message: "Photo deleted successfully" });
});

export default router;
