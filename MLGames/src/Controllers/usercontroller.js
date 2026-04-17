import db from "../database/db.js";

// Função padrão para erro
function handleError(res, err) {
  return res.status(500).json({ erro: err.message });
}

// Listar todos
export function getAllUsers(req, res) {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return handleError(res, err);
    res.json(results);
  });
}

// Buscar por ID
export function getUserById(req, res) {
  const { id } = req.params;

  db.query("SELECT * FROM usuarios WHERE id = ?", [id], (err, results) => {
    if (err) return handleError(res, err);

    if (results.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.json(results[0]);
  });
}

// Criar usuário
export function createUser(req, res) {
  const { nome, idade } = req.body;

  if (!nome || !idade) {
    return res.status(400).json({ mensagem: "Nome e idade são obrigatórios" });
  }

  db.query(
    "INSERT INTO usuarios (nome, idade) VALUES (?, ?)",
    [nome, idade],
    (err, result) => {
      if (err) return handleError(res, err);

      res.status(201).json({
        id: result.insertId,
        nome,
        idade,
      });
    }
  );
}

// Atualizar usuário
export function updateUser(req, res) {
  const { id } = req.params;
  const { nome, idade } = req.body;

  if (!nome || !idade) {
    return res.status(400).json({ mensagem: "Nome e idade são obrigatórios" });
  }

  db.query(
    "UPDATE usuarios SET nome = ?, idade = ? WHERE id = ?",
    [nome, idade, id],
    (err, result) => {
      if (err) return handleError(res, err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
      }

      res.json({ mensagem: "Usuário atualizado com sucesso" });
    }
  );
}

// Deletar usuário
export function deleteUser(req, res) {
  const { id } = req.params;

  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
    if (err) return handleError(res, err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.json({ mensagem: "Usuário deletado com sucesso" });
  });
}
