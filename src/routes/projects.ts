import { Router, Request, Response, NextFunction } from "express";
import { db } from "../db/dataStore";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// GET /api/projects - list all projects
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await db.getProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id - get project by ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await db.getProjectById(req.params.id);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// POST /api/projects - create new project (Admin only)
router.post("/", authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, slug, description, techStack, imageUrl, images, projectUrl, githubUrl, order } =
      req.body;

    if (!title || !description) {
      res.status(400).json({ error: "Title and description are required" });
      return;
    }

    const normalizedImages =
      Array.isArray(images) && images.length > 0
        ? images.filter(Boolean)
        : imageUrl
        ? [imageUrl]
        : [];

    const newProj = await db.createProject({
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description,
      techStack: Array.isArray(techStack) ? techStack : [],
      images: normalizedImages,
      imageUrl: normalizedImages[0] || imageUrl || "",
      projectUrl: projectUrl || "",
      githubUrl: githubUrl || "",
      order: typeof order === "number" ? order : 99,
    });

    res.status(201).json(newProj);
  } catch (err) {
    next(err);
  }
});

// PUT /api/projects/:id - update project (Admin only)
router.put("/:id", authenticateAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await db.updateProject(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id - delete project (Admin only)
router.delete(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const success = await db.deleteProject(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.json({ success: true, message: "Project deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
