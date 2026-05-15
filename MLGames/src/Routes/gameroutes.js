import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.js";
import {
  listGames, getGame, createGame, updateGame, deleteGame,
} from "../controllers/gameController.js";

const router = Router();

router.get("/", listGames);
router.get("/:id", getGame);
router.post("/", authenticateToken, requireRole("admin"), createGame);
router.put("/:id", authenticateToken, requireRole("admin"), updateGame);
router.delete("/:id", authenticateToken, requireRole("admin"), deleteGame);

export default router;
