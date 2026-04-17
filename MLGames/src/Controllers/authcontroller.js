import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET;

export function login(req, res) {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Login e senha são obrigatórios",
    });
  }

  // busca por email OU nome
  db.query(
    "SELECT * FROM usuarios WHERE email = ? OR nome = ?",
    [login, login],
    async (err, results) => {
      if (err) return res.status(500).json({ erro: "Erro no servidor" });

      if (results.length === 0) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "Credenciais inválidas",
        });
      }

      const user = results[0];

      const senhaValida = await bcrypt.compare(senha, user.senha);

      if (!senhaValida) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "Credenciais inválidas",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          nome: user.nome,
          role: user.role,
        },
        SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        sucesso: true,
        token,
        usuario: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
        },
      });
    }
  );
}