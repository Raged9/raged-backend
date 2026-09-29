import { Router, Request, Response } from "express";
import { db } from "../db/dataStore";

const router = Router();

// POST /api/contact - submit contact message
router.post("/", (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: "Name, email, and message are required" });
    return;
  }

  const saved = db.addMessage({ name, email, message });
  console.log(`[Contact Form] New message from ${name} <${email}>`);

  res.status(201).json({
    success: true,
    message: "Thank you for reaching out! Edgar will get back to you soon.",
    data: saved,
  });
});

export default router;
