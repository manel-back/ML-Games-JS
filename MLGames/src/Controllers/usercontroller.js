import db from "../config/db.js";
import bcrypt from "bcrypt";

// Função padrão para erro
function handleError(res, err) {
  console.error(err);
  return res.status(500).json({
    sucesso: false,
    mensagem: "Erro interno do servidor",
  });
}

// 📄 Listar todos os usuários
export async function getAllUsers(req, res) {
  try {
    const [users] = await db.query(
      "SELECT id, nome, email, role, created_at FROM usuarios"
    );

    res.json({
      sucesso: true,
      dados: users,
    });
  } catch (err) {
    return handleError(res, err);
  }
}

// 🔍 Buscar usuário por ID
export async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const [results] = await db.query(
      "SELECT id, nome, email, role, created_at FROM usuarios WHERE id = ?",
      [id]
    );

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
  } catch (err) {
    return handleError(res, err);
  }
}

// 👤 Criar usuário
export async function createUser(req, res) {
  let { nome, email, senha, role } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Nome, email e senha são obrigatórios",
    });
  }

  if (senha.length < 6) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Senha deve ter pelo menos 6 caracteres",
    });
  }

  email = email.toLowerCase();

  try {
    const hash = await bcrypt.hash(senha, 10);

    // 🔐 só admin pode definir role
    if (req.user && req.user.role === "admin") {
      role = role || "cliente";
    } else {
      role = "cliente";
    }

    const [result] = await db.query(
      "INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)",
      [nome, email, hash, role]
    );

    res.status(201).json({
      sucesso: true,
      dados: {
        id: result.insertId,
        nome,
        email,
        role,
      },
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Email já cadastrado",
      });
    }
    return handleError(res, err);
  }
}

// ✏️ Atualizar usuário
export async function updateUser(req, res) {
  const { id } = req.params;
  let { nome, email, role } = req.body;

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

  // 🔐 só pode editar a si mesmo ou admin
  if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
    return res.status(403).json({
      sucesso: false,
      mensagem: "Acesso negado",
    });
  }

  // 🔐 só admin pode mudar role
  if (req.user.role !== "admin") {
    role = req.user.role;
  }

  email = email.toLowerCase();

  try {
    const [result] = await db.query(
      "UPDATE usuarios SET nome = ?, email = ?, role = ? WHERE id = ?",
      [nome, email, role, id]
    );

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
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Email já cadastrado",
      });
    }
    return handleError(res, err);
  }
}

// 🗑️ Deletar usuário
export async function deleteUser(req, res) {
  const { id } = req.params;

  // 🔐 só pode deletar a si mesmo ou admin
  if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
    return res.status(403).json({
      sucesso: false,
      mensagem: "Acesso negado",
    });
  }

  try {
    const [result] = await db.query(
      "DELETE FROM usuarios WHERE id = ?",
      [id]
    );

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
  } catch (err) {
    return handleError(res, err);
  }
}