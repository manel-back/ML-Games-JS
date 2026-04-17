export function isAdmin(req, res, next) {
  // garante que o usuário foi autenticado primeiro
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Usuário não autenticado",
    });
  }

  // verifica permissão
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Acesso negado: apenas administradores",
    });
  }

  // tudo ok, continua para a rota
  next();
}