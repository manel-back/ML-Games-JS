import db from "../database/db.js";

// Listar todos os itens
export async function getAllGames(req, res) {
  db.query("SELECT * FROM games", (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });

    res.json(results);
  });
}

// Buscar item por ID
export async function getGameById(req, res) {
  const { id } = req.params;

  db.query("SELECT * FROM games WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: "Game não encontrado" });
    }

    res.json(results[0]);
  });
}

// Criar item
export async function createGame(req, res) {
  const { nome, quantidade } = req.body;

  if (!nome || !quantidade) {
    return res
      .status(400)
      .json({ message: "Nome e quantidade são obrigatórios" });
  }

  db.query(
    "INSERT INTO itens (nome, quantidade) VALUES (?, ?)",
    [nome, quantidade],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });

      res.status(201).json({
        id: result.insertId,
        nome,
        quantidade,
      });
    }
  );
}

// Atualizar item
export async function updateGame(req, res) {
  const { id } = req.params;
  const { nome, quantidade } = req.body;

  db.query(
    "UPDATE itens SET nome = ?, quantidade = ? WHERE id = ?",
    [nome, quantidade, id],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Item não encontrado" });
      }

      res.json({ message: "Item atualizado com sucesso" });
    }
  );
}

// Deletar item
export async function deleteGame(req, res) {
  const { id } = req.params;

  db.query("DELETE FROM games WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ erro: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Game não encontrado" });
    }

    res.json({ message: "Game removido com sucesso" });
  });
}
