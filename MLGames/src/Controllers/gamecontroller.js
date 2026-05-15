import { db } from "../config/db.js";

export async function listGames(_req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM games ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("listGames error:", err);
    res.status(500).json({ error: "Erro interno" });
  }
}

export async function getGame(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM games WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Game não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error("getGame error:", err);
    res.status(500).json({ error: "Erro interno" });
  }
}

export async function createGame(req, res) {
  try {
    const { nome, genero, preco, plataforma } = req.body;
    if (!nome || preco == null) {
      return res.status(400).json({ error: "nome e preco são obrigatórios" });
    }
    const [result] = await db.query(
      "INSERT INTO games (nome, genero, preco, plataforma) VALUES (?, ?, ?, ?)",
      [nome, genero ?? null, preco, plataforma ?? null]
    );
    res.status(201).json({ id: result.insertId, nome, genero, preco, plataforma });
  } catch (err) {
    console.error("createGame error:", err);
    res.status(500).json({ error: "Erro interno" });
  }
}

export async function updateGame(req, res) {
  try {
    const { nome, genero, preco, plataforma } = req.body;
    const [result] = await db.query(
      "UPDATE games SET nome = ?, genero = ?, preco = ?, plataforma = ? WHERE id = ?",
      [nome, genero ?? null, preco, plataforma ?? null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Game não encontrado" });
    res.json({ id: Number(req.params.id), nome, genero, preco, plataforma });
  } catch (err) {
    console.error("updateGame error:", err);
    res.status(500).json({ error: "Erro interno" });
  }
}

export async function deleteGame(req, res) {
  try {
    const [result] = await db.query("DELETE FROM games WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Game não encontrado" });
    res.status(204).send();
  } catch (err) {
    console.error("deleteGame error:", err);
    res.status(500).json({ error: "Erro interno" });
  }
}
