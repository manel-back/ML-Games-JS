create database db_mlgames;
use db_mlgames;

-----------------------------------------------------

-- 👤 USUÁRIOS (admin e cliente)
create table usuarios(
	id int primary key auto_increment,
    nome varchar(100),
    email varchar(100) not null unique,
    senha varchar(255) not null,
    role varchar(20) not null, -- admin ou cliente
    created_at timestamp default current_timestamp
);

-- 👨‍💼 EXEMPLO DE ADMIN
insert into usuarios (nome, email, senha, role) values
('Admin', 'admin@gmail.com', 'admin', 'admin');

-----------------------------------------------------

-- 🎮 CONSOLES
create table consoles(
	id int primary key auto_increment,
    nome varchar(50) not null
);

insert into consoles (nome) values
('PC'),
('PS1'),
('PS2'),
('PS3'),
('PS4'),
('Xbox 360');

-----------------------------------------------------

-- 🎯 GAMES
create table games(
	id int primary key auto_increment,
    nome varchar(100) not null,
    descricao text,
    ano int,
    empresa varchar(100),
    tamanho varchar(50),
    download_link text not null,
    imagem text, -- capa do jogo
    created_at timestamp default current_timestamp
);

-----------------------------------------------------

-- 🔗 RELAÇÃO GAME x CONSOLE
create table game_console(
	game_id int not null,
    console_id int not null,
    primary key (game_id, console_id),
    foreign key (game_id) references games(id) on delete cascade,
    foreign key (console_id) references consoles(id) on delete cascade
);

-----------------------------------------------------

-- 📥 DOWNLOADS (contador)
create table downloads(
	id int primary key auto_increment,
    usuario_id int null,
    game_id int not null,
    data_download timestamp default current_timestamp,
    foreign key (usuario_id) references usuarios(id) on delete set null,
    foreign key (game_id) references games(id) on delete cascade
);