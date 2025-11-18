import { connection } from "./connection.js"


export async function criarPost(dados, idUser) {
    const comando = `
    INSERT INTO post_avaliacao (titulo, id_filme, avaliacao, id_user, nota, criado_em)
    VALUES
    (?,?,?,?,?,?);
`;

    let hoje = new Date();

    let [info] = await connection.query(comando, [
        dados.titulo,
        dados.id_filme,
        dados.avaliacao,
        idUser,
        dados.nota,
        hoje

    ]);
    return info.insertId
}

export async function VerSeCurtiu(id_user) {
    const comando = `
    SELECT id_user
    FROM curtidas
    WHERE id_user = ?
    `

    const info = await connection.query(comando, [
        id_user
    ])
    return info;
}


export async function listarPostPorFilme() {
    const comando = `
SELECT usuarios.nome, post_avaliacao.titulo, post_avaliacao.criado_em, post_avaliacao.avaliacao, post_avaliacao.nota, post_avaliacao.id_filme,
       COUNT(curtidas.id_curtida) AS curtidas
FROM post_avaliacao
INNER JOIN usuarios ON usuarios.id_user = post_avaliacao.id_user
LEFT JOIN curtidas ON curtidas.id_post = post_avaliacao.id_post
GROUP BY post_avaliacao.id_post;
    `
    let [info] = await connection.query(comando)
    return info;
}

export async function PuxarInfoPost() {
    let [resultados] = await connection.query(`
        SELECT usuarios.nome, usuarios.id_user, avaliacao, post_avaliacao.nota, COUNT(curtidas.id_curtida) AS curtidas
        FROM post_avaliacao
        INNER JOIN usuarios ON usuarios.id_user = post_avaliacao.id_user
        LEFT JOIN curtidas ON curtidas.id_post = post_avaliacao.id_post
        GROUP BY post_avaliacao.id_post
        ORDER BY post_avaliacao.criado_em DESC
        `)
    return resultados
}

export async function MediaCurtidas(id_filme) {
    let [resultados] = await connection.query(`
        SELECT AVG(nota) AS MediaCurtidas
        FROM post_avaliacao
        WHERE id_filme = ?;
        `, [id_filme])
    return resultados
}

export async function ContagemComentarios(id_filme) {
    let [resultados] = await connection.query(`
        SELECT COUNT(avaliacao) AS ContarAvaliacao
        FROM post_avaliacao
        WHERE id_filme = ?
        `, [id_filme])
    return resultados
}

export async function listarPostPorIdFilme(id_filme, id_user) {
    const comando = `
        SELECT 
            post_avaliacao.id_post,
            post_avaliacao.id_user,
            usuarios.nome,
            post_avaliacao.titulo,
            post_avaliacao.criado_em,
            post_avaliacao.avaliacao,
            post_avaliacao.nota,
            post_avaliacao.id_filme,
            COUNT(curtidas.id_curtida) AS curtidas,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM curtidas 
                    WHERE curtidas.id_post = post_avaliacao.id_post 
                    AND curtidas.id_user = ?
                ) THEN 1
                ELSE 0
            END AS usuario_curtiu
        FROM post_avaliacao
        INNER JOIN usuarios ON usuarios.id_user = post_avaliacao.id_user
        LEFT JOIN curtidas ON curtidas.id_post = post_avaliacao.id_post
        WHERE post_avaliacao.id_filme = ?
        GROUP BY post_avaliacao.id_post
        ORDER BY post_avaliacao.criado_em DESC;
    `;

    const [linhas] = await connection.query(comando, [id_user, id_filme]);
    return linhas;
}

export async function listarPostPorIdFilmeDeslogado(id_filme) {
    const comando = `
        SELECT 
            post_avaliacao.id_post,
            post_avaliacao.id_user,
            usuarios.nome,
            post_avaliacao.titulo,
            post_avaliacao.criado_em,
            post_avaliacao.avaliacao,
            post_avaliacao.nota,
            post_avaliacao.id_filme,
            COUNT(curtidas.id_curtida) AS curtidas
        FROM post_avaliacao
        INNER JOIN usuarios ON usuarios.id_user = post_avaliacao.id_user
        LEFT JOIN curtidas ON curtidas.id_post = post_avaliacao.id_post
        WHERE post_avaliacao.id_filme = ?
        GROUP BY post_avaliacao.id_post
        ORDER BY post_avaliacao.criado_em DESC;
    `;

    const [linhas] = await connection.query(comando, [id_filme]);
    return linhas;
}

export async function listarAvaliacoesRecentes(id_user) {
    const comando = `
        SELECT 
            post_avaliacao.id_post,
            post_avaliacao.id_user,
            usuarios.nome,
            post_avaliacao.titulo,
            post_avaliacao.id_filme,
            post_avaliacao.avaliacao,
            post_avaliacao.nota,
            COUNT(curtidas.id_curtida) AS curtidas,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM curtidas 
                    WHERE curtidas.id_post = post_avaliacao.id_post 
                    AND curtidas.id_user = ?
                ) THEN 1
                ELSE 0
            END AS usuario_curtiu
        FROM post_avaliacao
        INNER JOIN usuarios ON usuarios.id_user = post_avaliacao.id_user
        LEFT JOIN curtidas ON curtidas.id_post = post_avaliacao.id_post
        GROUP BY post_avaliacao.id_post
        ORDER BY post_avaliacao.criado_em DESC
        LIMIT 6;
    `;

    const [linhas] = await connection.query(comando, [id_user]);
    return linhas;
}

export async function listarAvaliacoesRecentesDeslogado() {
    const comando = `
        SELECT 
            post_avaliacao.id_post,
            post_avaliacao.id_user,
            usuarios.nome,
            post_avaliacao.titulo,
            post_avaliacao.id_filme,
            post_avaliacao.avaliacao,
            post_avaliacao.nota,
            COUNT(curtidas.id_curtida) AS curtidas
        FROM post_avaliacao
        INNER JOIN usuarios ON usuarios.id_user = post_avaliacao.id_user
        LEFT JOIN curtidas ON curtidas.id_post = post_avaliacao.id_post
        GROUP BY post_avaliacao.id_post
        ORDER BY post_avaliacao.criado_em DESC
        LIMIT 6;
    `;

    const [linhas] = await connection.query(comando);
    return linhas;
}

export async function listarPostPorUsuario(idUser) {
    const comando = `
SELECT 
    post_avaliacao.id_post, 
    usuarios.nome, 
    post_avaliacao.titulo, 
    post_avaliacao.criado_em, 
    post_avaliacao.avaliacao, 
    post_avaliacao.nota, 
    post_avaliacao.id_filme,
    COUNT(curtidas.id_curtida) AS curtidas
FROM post_avaliacao
INNER JOIN usuarios 
    ON usuarios.id_user = post_avaliacao.id_user
LEFT JOIN curtidas 
    ON curtidas.id_post = post_avaliacao.id_post
WHERE usuarios.id_user = ?
GROUP BY 
    post_avaliacao.id_post, 
    usuarios.nome, 
    post_avaliacao.titulo, 
    post_avaliacao.criado_em, 
    post_avaliacao.avaliacao, 
    post_avaliacao.nota, 
    post_avaliacao.id_filme
ORDER BY post_avaliacao.criado_em DESC;
    `

    let [info] = await connection.query(comando, [idUser]);
    return info;
}




export async function curtirPost(idUser, idPost) {
    const [curtida] = await connection.query(`
        SELECT id_curtida FROM curtidas WHERE id_user = ? AND id_post = ?
    `, [idUser, idPost]);

    if (curtida.length > 0) {
        await connection.query(`
            DELETE FROM curtidas WHERE id_user = ? AND id_post = ?
        `, [idUser, idPost]);
        return { liked: false };
    } else {
        await connection.query(`
            INSERT INTO curtidas (id_user, id_post)
            VALUES (?, ?)
        `, [idUser, idPost]);
        return { liked: true };
    }
}




