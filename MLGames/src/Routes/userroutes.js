import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.js";
import { createUser, listUsers, getUser, deleteUser } from "../controllers/userController.js";

const router = Router();

// Cadastro público
router.post("/", createUser);

// Rotas protegidas
router.get("/", authenticateToken, requireRole("admin"), listUsers);
router.get("/:id", authenticateToken, getUser);
router.delete("/:id", authenticateToken, requireRole("admin"), deleteUser);

export default router;
