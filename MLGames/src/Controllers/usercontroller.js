import bcrypt from "bcryptjs";
import { db } from "../config/db.js";

export async function createUser(req, res) {
  try {
    const { nome, email, senha, role = "user" } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "nome, email e senha são obrigatórios" });
    }

    const hash = await bcrypt.hash(senha, 10);

    const [result] = await db.query(
      "INSERT INTO users (nome, email, senha, role) VALUES (?, ?, ?, ?)",
      [nome, email, hash, role]
    );

    return res.status(201).json({ id: result.insertId, nome, email, role });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email já cadastrado" });
    }
    console.error("createUser error:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

export async function listUsers(_req, res) {
  try {
    const [rows] = await db.query(
      "SELECT id, nome, email, role FROM users ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("listUsers error:", err);
    res.status(500).json({ error: "Erro interno" });
  }
}

export async function getUser(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT id, nome, email, role FROM users WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error("getUser error:", err);
    res.status(500).json({ error: "Erro interno" });
  }
}

export async function deleteUser(req, res) {
  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.status(204).send();
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ error: "Erro interno" });
  }
}
