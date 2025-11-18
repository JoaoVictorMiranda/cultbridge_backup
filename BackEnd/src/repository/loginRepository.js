import { connection } from "./connection.js"
import bcrypt from 'bcrypt';
const tileCount = 12;


export async function inserirUsuario(dados) {
    let comando = `
    INSERT INTO usuarios (nome, nascimento, email, senha, criado_em)
    VALUES
    (?,?,?,?,NOW());
    `;
    const hash = await bcrypt.hash(dados.senha, tileCount)

    let [registros] = await connection.query(comando, [
        dados.nome,
        dados.nascimento,
        dados.email,
        hash
    ])
    return registros.insertId;
}

export async function loginUsuario(email, senha) {
    const comandoBuscar = `
    SELECT id_user, nome, email, nascimento, foto_perfil, senha 
    FROM usuarios 
    WHERE email = ?`;

    let [info] = await connection.query(comandoBuscar, [email]);
        if (info.length === 0) {
            throw new Error('Credenciais inválidas')
        }
    const usuario = info[0]

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
        
    if (!senhaCorreta) {
        throw new Error('Credenciais inválidas')
    }

    const { senha: _, ...usuarioSemSenha } = usuario
        
    return usuarioSemSenha

}