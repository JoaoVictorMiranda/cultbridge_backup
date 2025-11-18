CREATE DATABASE cultbridge;
USE cultbridge;


CREATE TABLE ADMIN(
id_admin int primary key auto_increment,
nome varchar(200),
email varchar(200) UNIQUE,
senha varchar(255),
criado_em datetime,
isAdmin boolean default true
);

CREATE TABLE usuarios(
 id_user int primary key auto_increment, 
nome varchar(300),
nascimento DATE,
email varchar(200) UNIQUE ,
senha varchar(255),
chat_acesso boolean default false,
foto_perfil varchar(500),
criado_em datetime
);


CREATE TABLE seguidores (
    id_seguidores INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT NOT NULL,
    id_seguidor INT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
    FOREIGN KEY (id_seguidor) REFERENCES usuarios(id_user)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
    CONSTRAINT uq_seguidor UNIQUE (id_user, id_seguidor)
);




SELECT * FROM usuarios;

    


CREATE TABLE post_avaliacao (
    id_post int PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200),
    id_filme VARCHAR(200),
    avaliacao varchar(300),
    id_user int,
    curtidas int,
    nota int,
    criado_em datetime,
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user)
);

SELECT * FROM post_avaliacao;



CREATE TABLE curtidas(
    id_curtida INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT,
    id_post INT,
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_post) REFERENCES post_avaliacao(id_post)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    UNIQUE (id_user, id_post)
);
SELECT * FROM curtidas;

CREATE TABLE assistidos (
	id_assistido int primary key auto_increment,
    id_usuario int,
    id_filme int,
    foreign key (id_usuario) REFERENCES usuarios(id_user)
);

CREATE TABLE assistir_tarde (
	id_assistido int primary key auto_increment,
    id_usuario int,
    id_filme int,
    foreign key (id_usuario) REFERENCES usuarios(id_user)
);



CREATE TABLE favoritos (
	id_favorito int primary key auto_increment,
    id_usuario int,
    id_filme int,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_user)
);

CREATE TABLE comunidades (
    id_comunidade INT PRIMARY KEY AUTO_INCREMENT,          
    nome VARCHAR(200) NOT NULL,                            
    descricao TEXT,                                        
    id_criador INT NOT NULL,                               
    foto_capa VARCHAR(500),                                
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,         
    ativa BOOLEAN DEFAULT true,                           
    FOREIGN KEY (id_criador) REFERENCES usuarios(id_user)  

);
SELECT * FROM comunidades;


CREATE TABLE comunidade_membros (
    id_membro INT PRIMARY KEY AUTO_INCREMENT,              
    id_comunidade INT,                                      
    id_user INT,                                           
    data_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,        
    is_moderador BOOLEAN DEFAULT false,                     
    FOREIGN KEY (id_comunidade) REFERENCES comunidades(id_comunidade) ON DELETE CASCADE,
    
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user) ON DELETE CASCADE,
    
    UNIQUE KEY (id_comunidade, id_user)                    
);
SELECT * FROM comunidade_membros;



CREATE TABLE comunidade_posts (
    id_post_comunidade INT PRIMARY KEY AUTO_INCREMENT,     
    id_comunidade INT,                                     
    id_user INT,                                           
    conteudo TEXT NOT NULL,                                
    tipo ENUM('texto', 'foto') DEFAULT 'texto',            
    url_imagem VARCHAR(500),                               
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,          
    editado_em DATETIME,                                   
    status ENUM('ativo', 'removido', 'pendente') DEFAULT 'ativo',  
    motivo_remocao TEXT,                                   
    FOREIGN KEY (id_comunidade) REFERENCES comunidades(id_comunidade) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user) ON DELETE CASCADE
);


CREATE TABLE post_denuncias (
    id_denuncia INT PRIMARY KEY AUTO_INCREMENT,            
    id_post_comunidade INT,                                
    id_user_denunciante INT,                               
    motivo ENUM('pornografia', 'conteudo_improprio', 'spam', 'outro'),  
    descricao TEXT,                                        
    data_denuncia DATETIME DEFAULT CURRENT_TIMESTAMP,      
    status ENUM('pendente', 'analisado', 'rejeitado') DEFAULT 'pendente',  
    FOREIGN KEY (id_post_comunidade) REFERENCES comunidade_posts(id_post_comunidade) ON DELETE CASCADE,
    FOREIGN KEY (id_user_denunciante) REFERENCES usuarios(id_user) ON DELETE CASCADE
);


CREATE TABLE comunidade_curtidas (
    id_curtida_comunidade INT PRIMARY KEY AUTO_INCREMENT,  
    id_post_comunidade INT,                                
    id_user INT,                                           
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,          
    FOREIGN KEY (id_post_comunidade) REFERENCES comunidade_posts(id_post_comunidade) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user) ON DELETE CASCADE,
    UNIQUE KEY (id_post_comunidade, id_user)              
);


CREATE TABLE post_avaliacoes (
    id_avaliacao INT PRIMARY KEY AUTO_INCREMENT,           
    id_post_comunidade INT,                                
    id_user INT,                                           
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,          
    FOREIGN KEY (id_post_comunidade) REFERENCES comunidade_posts(id_post_comunidade) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user) ON DELETE CASCADE,
    UNIQUE KEY (id_post_comunidade, id_user)               
);


CREATE TABLE comunidade_chat (
    id_mensagem INT PRIMARY KEY AUTO_INCREMENT,            
    id_comunidade INT,                                     
    id_user INT,                                           
    mensagem TEXT NOT NULL,                                
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,          
    editado_em DATETIME,                                   
    FOREIGN KEY (id_comunidade) REFERENCES comunidades(id_comunidade) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES usuarios(id_user) ON DELETE CASCADE
    
);

SELECT * FROM comunidades;
SELECT * FROM comunidade_membros;
SELECT * FROM comunidade_posts;
SELECT * FROM comunidade_chat;

            select id_user from comunidade_membros
            where id_user = 2 AND id_comunidade = 1;


SHOW TABLES;