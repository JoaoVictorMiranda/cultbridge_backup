import { connection } from "./connection.js";

export async function alterarFotoPerfil(idUser, caminhoImagem) {
    try {
        const comando = `
        UPDATE usuarios
        SET foto_perfil = ?
        WHERE id_user = ?
        `;
        
        console.log('Executando query:', { idUser, caminhoImagem });
        
        const [info] = await connection.query(comando, [caminhoImagem, idUser]);
        
        console.log('Resultado da query:', info);
        
        return info.affectedRows;
    } catch (error) {
        console.error('Erro no repository alterarFotoPerfil:', error);
        throw error;
    }
}

export async function ContarUsuarios() {
        let [resultados] = await connection.query(`
        select count(id_user) as usuarios
        from usuarios        
        `)
        return resultados
}

export async function seguirUsuario(idUser, idFollower) {
    const comando = `
        INSERT INTO seguidores (id_user, id_seguidor)
        VALUES (?, ?);
    `;

    const [info] = await connection.query(comando, [
        idUser,
        idFollower
    ]);

    return info;
}

export async function buscarUsuarioPorId(idUser) {
    try {
        const comando = `
            SELECT 
                u.id_user,
                u.nome,
                u.nascimento,
                u.foto_perfil,
                (
                    SELECT COUNT(*) FROM seguidores s WHERE s.id_user = u.id_user
                ) AS seguidores,
                (
                    SELECT COUNT(*) FROM seguidores s WHERE s.id_seguidor = u.id_user
                ) AS seguindo
            FROM usuarios u
            WHERE u.id_user = ?
        `;
        
        const [rows] = await connection.query(comando, [idUser]);
        return rows[0];
    } catch (error) {
        console.error('Erro no repository buscarUsuarioPorId:', error);
        throw error;
    }
}

export async function deixarDeSeguirUsuario(idUser, idSeguidor) {
    try {
        const comando = `
            DELETE FROM seguidores
            WHERE id_user = ? AND id_seguidor = ?
        `;
        const [info] = await connection.query(comando, [idUser, idSeguidor]);
        return info;
    } catch (error) {
        console.error('Erro no repository deixarDeSeguirUsuario:', error);
        throw error;
    }
}

export async function buscarMeusSeguidores(idUser) {
    try {
        const comando = `
            SELECT 
                u.id_user,
                u.nome,
                u.foto_perfil
            FROM seguidores s
            INNER JOIN usuarios u ON u.id_user = s.id_seguidor
            WHERE s.id_user = ?
        `;
        const [rows] = await connection.query(comando, [idUser]);
        return rows;
    } catch (error) {
        console.error('Erro no repository buscarMeusSeguidores:', error);
        throw error;
    }
}
