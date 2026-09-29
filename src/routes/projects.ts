import { Router, Request, Response } from "express";
import { db } from "../db/dataStore";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// GET /api/projects - list all projects
router.get("/", (req: Request, res: Response) => {
  const projects = db.getProjects();
  res.json(projects);
});

// GET /api/projects/:id - get project by ID
router.get("/:id", (req: Request, res: Response) => {
  const project = db.getProjectById(req.params.id);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(project);
});

// POST /api/projects - create new project (Admin only)
router.post("/", authenticateAdmin, (req: Request, res: Response) => {
  const { title, slug, description, techStack, imageUrl, projectUrl, githubUrl, order } = req.body;

  if (!title || !description) {
    res.status(400).json({ error: "Title and description are required" });
    return;
  }

  const newProj = db.createProject({
    title,
    slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description,
    techStack: Array.isArray(techStack) ? techStack : [],
    imageUrl: imageUrl || "",
    projectUrl: projectUrl || "",
    githubUrl: githubUrl || "",
    order: typeof order === "number" ? order : 99,
  });

  res.status(201).json(newProj);
});

// PUT /api/projects/:id - update project (Admin only)
router.put("/:id", authenticateAdmin, (req: Request, res: Response) => {
  const updated = db.updateProject(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(updated);
});

// DELETE /api/projects/:id - delete project (Admin only)
router.delete("/:id", authenticateAdmin, (req: Request, res: Response) => {
  const success = db.deleteProject(req.params.id);
  if (!success) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json({ success: true, message: "Project deleted successfully" });
});

export default router;
