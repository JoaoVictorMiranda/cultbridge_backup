import { connection } from './connection.js';

export async function EnviarMensagem(idSala, Usuario, dados) {
        let [resultados] = await connection.query(`
                insert into comunidade_chat (id_comunidade, id_user, mensagem, criado_em, editado_em)
                values
                (?,?,?,NOW(), NULL)
                `, [idSala, Usuario, dados.mensagem])
        return resultados
}

export async function BuscarComunidadesFiltro(busca) {
        let [resultados] = await connection.query(`
        select * from comunidades
        where nome like ?        
        `, [`%${busca}%`])
        return resultados
}

export async function ListarComunidades() {
        let [resultados] = await connection.query(`
                select * from comunidades                
                `)
        return resultados
}

export async function ContarComunidades() {
        let [resultados] = await connection.query(`
        select count(id_user) as usuarios
        from usuarios        
        `)
        return resultados
}

export async function criarComunidades(dados, caminho, idCriador) {
        const comando = `
        INSERT INTO comunidades ( nome, descricao, id_criador, foto_capa)
        VALUES
        (?,?,?,?);
        `;
        let [info] = await connection.query(comando, [
                dados.nome,
                dados.descricao,
                idCriador,
                caminho
        ]);

        return info.insertId;
}


export async function InsertMember(idComunity, idUser) {
        const comando = `
                INSERT INTO comunidade_membros(id_comunidade, id_user, is_moderador)
                VALUES
                (?, ?, DEFAULT);
        `;
        let [info] = await connection.query(comando, [
                idComunity,
                idUser
        ])
        return info.insertId;
}
export async function InsertModerator(idComunity, idUser) {
        const comando = `
                INSERT INTO comunidade_membros(id_comunidade, id_user, is_moderador)
                VALUES
                (?, ?, TRUE);
        `;
        let [info] = await connection.query(comando, [
                idComunity,
                idUser
        ])
        return info.insertId;
}

export async function CreatePost(data, idUser) {
        const comando = `
            INSERT INTO comunidade_posts 
            (id_comunidade, id_user, conteudo, tipo, url_imagem)
            VALUES (?, ?, ?, ?, ?);
        `;

        let [info] = await connection.query(comando, [
                data.id_comunidade,
                idUser,
                data.conteudo,
                data.tipo || 'texto',
                data.url_imagem || null
        ]);

        return info.insertId;
}



export async function sendMessage(idComunidade, dados, idUser) {
        const comando = `
                INSERT INTO comunidade_chat(id_comunidade, id_user, mensagem, editado_em)
                 VALUES
                 (?,?,?,null);
        `;
        let [info] = await connection.query(comando, [
                idComunidade,
                idUser,
                dados.mensagem
        ]);
        return info.insertId
}



export async function listMessages(idSala) {
        const comando = `
            SELECT comunidade_chat.*, usuarios.foto_perfil, usuarios.nome
            FROM comunidade_chat
            INNER JOIN usuarios ON comunidade_chat.id_user = usuarios.id_user
            WHERE id_comunidade = ?;
        `;

        let [info] = await connection.query(comando, [idSala]);
        return info;
}

export async function VerificarUser(idUser, idSala) {
        const comando = `
            select id_user from comunidade_membros
            where id_user = ? AND id_comunidade = ?;
        `;
        let [info] = await connection.query(comando, [idUser, idSala]);

        return info
}