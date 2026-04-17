import db from "../config/db.js";
import bcrypt from "bcrypt";

// Função padrão para erro
function handleError(res, err) {
  console.error(err);
  return res.status(500).json({ erro: "Erro interno do servidor" });
}

// Listar todos
export function getAllUsers(req, res) {
  db.query(
    "SELECT id, nome, email, role, created_at FROM usuarios",
    (err, results) => {
      if (err) return handleError(res, err);

      res.json({
        sucesso: true,
        dados: results,
      });
    }
  );
}

// Buscar por ID
export function getUserById(req, res) {
  const { id } = req.params;

  db.query(
    "SELECT id, nome, email, role, created_at FROM usuarios WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return handleError(res, err);

      if (results.length === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Usuário não encontrado",
        });
      }

      res.json({
        sucesso: true,
        dados: results[0],
      });
    }
  );
}

// Criar usuário
export async function createUser(req, res) {
  let { nome, email, senha, role } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Nome, email e senha são obrigatórios",
    });
  }

  // Segurança: define padrão como cliente
  if (!role) role = "cliente";

  // Validação de role
  if (!["admin", "cliente"].includes(role)) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Role inválido",
    });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);

    db.query(
      "INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)",
      [nome, email, hash, role],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              sucesso: false,
              mensagem: "Email já cadastrado",
            });
          }
          return handleError(res, err);
        }

        res.status(201).json({
          sucesso: true,
          dados: {
            id: result.insertId,
            nome,
            email,
            role,
          },
        });
      }
    );
  } catch (err) {
    return handleError(res, err);
  }
}

// Atualizar usuário
export function updateUser(req, res) {
  const { id } = req.params;
  const { nome, email, role } = req.body;

  if (!nome || !email || !role) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Nome, email e role são obrigatórios",
    });
  }

  if (!["admin", "cliente"].includes(role)) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Role inválido",
    });
  }

  db.query(
    "UPDATE usuarios SET nome = ?, email = ?, role = ? WHERE id = ?",
    [nome, email, role, id],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            sucesso: false,
            mensagem: "Email já cadastrado",
          });
        }
        return handleError(res, err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Usuário não encontrado",
        });
      }

      res.json({
        sucesso: true,
        mensagem: "Usuário atualizado com sucesso",
      });
    }
  );
}

// Deletar usuário
export function deleteUser(req, res) {
  const { id } = req.params;

  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
    if (err) return handleError(res, err);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Usuário não encontrado",
      });
    }

    res.json({
      sucesso: true,
      mensagem: "Usuário deletado com sucesso",
    });
  });
}