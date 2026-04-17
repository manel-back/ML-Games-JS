export function login(req, res) {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({
      success: false,
      message: "Login e senha são obrigatórios",
    });
  }

  db.query(
    "SELECT * FROM usuarios WHERE email = ? OR username = ?",
    [login, login],
    async (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Erro no servidor",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Credenciais inválidas",
        });
      }

      const user = results[0];

      const senhaValida = await bcrypt.compare(senha, user.senha);

      if (!senhaValida) {
        return res.status(401).json({
          success: false,
          message: "Credenciais inválidas",
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

      return res.json({
        success: true,
        message: "Login realizado com sucesso",
        data: {
          token,
          user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role,
          },
        },
      });
    }
  );
}