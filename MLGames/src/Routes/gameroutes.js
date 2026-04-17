import express from "express";
import { getAllGames, getGameById, createGame, updateGame, deleteGame } from "../Controllers/gamecontroller.js";
import { authenticateToken } from '../middleware/authmiddleware.js';

const router = express.Router();

router.get("/", authenticateToken, getAllGames);
router.get("/:id", authenticateToken, getGameById);

router.post("/", authenticateToken, createGame);
router.put("/:id", authenticateToken, updateGame);
router.delete("/:id", authenticateToken, deleteGame);

export default router;