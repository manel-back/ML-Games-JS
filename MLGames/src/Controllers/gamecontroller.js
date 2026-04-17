import db from "../config/db.js";

// Função padrão de erro
function handleError(res, err) {
  console.error(err);
  return res.status(500).json({ erro: "Erro interno do servidor" });
}

// Listar todos
export function getAllGames(req, res) {
  db.query("SELECT * FROM games", (err, results) => {
    if (err) return handleError(res, err);

    res.json({
      sucesso: true,
      dados: results,
    });
  });
}

// Buscar por ID
export function getGameById(req, res) {
  const { id } = req.params;

  db.query("SELECT * FROM games WHERE id = ?", [id], (err, results) => {
    if (err) return handleError(res, err);

    if (results.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Game não encontrado",
      });
    }

    res.json({
      sucesso: true,
      dados: results[0],
    });
  });
}

// Criar game
export function createGame(req, res) {
  const { nome, descricao, ano, empresa, tamanho, download_link, imagem } = req.body;

  if (!nome || !download_link) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Nome e link de download são obrigatórios",
    });
  }

  db.query(
    `INSERT INTO games 
    (nome, descricao, ano, empresa, tamanho, download_link, imagem) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nome, descricao, ano, empresa, tamanho, download_link, imagem],
    (err, result) => {
      if (err) return handleError(res, err);

      res.status(201).json({
        sucesso: true,
        dados: {
          id: result.insertId,
          nome,
        },
      });
    }
  );
}

// Atualizar game
export function updateGame(req, res) {
  const { id } = req.params;
  const { nome, descricao, ano, empresa, tamanho, download_link, imagem } = req.body;

  db.query(
    `UPDATE games 
     SET nome = ?, descricao = ?, ano = ?, empresa = ?, tamanho = ?, download_link = ?, imagem = ?
     WHERE id = ?`,
    [nome, descricao, ano, empresa, tamanho, download_link, imagem, id],
    (err, result) => {
      if (err) return handleError(res, err);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Game não encontrado",
        });
      }

      res.json({
        sucesso: true,
        mensagem: "Game atualizado com sucesso",
      });
    }
  );
}

// Deletar game
export function deleteGame(req, res) {
  const { id } = req.params;

  db.query("DELETE FROM games WHERE id = ?", [id], (err, result) => {
    if (err) return handleError(res, err);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Game não encontrado",
      });
    }

    res.json({
      sucesso: true,
      mensagem: "Game removido com sucesso",
    });
  });
}