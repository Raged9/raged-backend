import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authenticateAdmin, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

const DEFAULT_ADMIN = {
  id: "admin-1",
  email: process.env.ADMIN_EMAIL || "edgar@portfolio.dev",
  password: process.env.ADMIN_PASSWORD || "admin123",
  name: "Edgar (Raged)",
};

// POST /api/admin/login
router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  const isValidEmail = email === DEFAULT_ADMIN.email || email === "admin@portfolio.local";
  const isValidPassword = password === DEFAULT_ADMIN.password;

  if (isValidEmail && isValidPassword) {
    const secret = process.env.JWT_SECRET || "edgar_portfolio_jwt_secret_key_2026_super_secure";
    const token = jwt.sign(
      { id: DEFAULT_ADMIN.id, email: email },
      secret,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: DEFAULT_ADMIN.id,
        email: DEFAULT_ADMIN.email,
        name: DEFAULT_ADMIN.name,
      },
    });
    return;
  }

  res.status(401).json({ error: "Invalid email or password" });
});

// GET /api/admin/me
router.get("/me", authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    user: {
      id: req.user?.id || DEFAULT_ADMIN.id,
      email: req.user?.email || DEFAULT_ADMIN.email,
      name: DEFAULT_ADMIN.name,
    },
  });
});

export default router;
