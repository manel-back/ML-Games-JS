CREATE DATABASE db_mlgames;
USE db_mlgames;

-----------------------------------------------------

-- 👤 USUÁRIOS (admin e cliente)
CREATE TABLE usuarios(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100), -- nome real
    username VARCHAR(50) NOT NULL UNIQUE, -- login único
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- admin ou cliente
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 👨‍💼 ADMIN PADRÃO
INSERT INTO usuarios (nome, username, email, senha, role) VALUES
('Emannuel', 'manel', 'manel@gmail.com', 'manel', 'admin');

-----------------------------------------------------

-- 🎮 CONSOLES
CREATE TABLE consoles(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL
);

INSERT INTO consoles (nome) VALUES
('PC'),
('PS1'),
('PS2'),
('PS3'),
('PS4'),
('Xbox 360');

-----------------------------------------------------

-- 🎯 GAMES
CREATE TABLE games(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ano INT,
    empresa VARCHAR(100),
    tamanho VARCHAR(50),
    download_link TEXT NOT NULL,
    imagem TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-----------------------------------------------------

-- 🔗 RELAÇÃO GAME x CONSOLE
CREATE TABLE game_console(
    game_id INT NOT NULL,
    console_id INT NOT NULL,
    PRIMARY KEY (game_id, console_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (console_id) REFERENCES consoles(id) ON DELETE CASCADE
);

-----------------------------------------------------

-- 📥 DOWNLOADS (contador)
CREATE TABLE downloads(
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NULL,
    game_id INT NOT NULL,
    data_download TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);