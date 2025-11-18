import { connection } from "./connection.js";



export async function favoritasFilme(idUser, idFilme){
        const comando = `
        INSERT INTO favoritos(id_usuario,id_filme)
        VALUES
        (?,?);
        `;

        let [info] = await connection.query(comando,[
                idUser,
                idFilme
        ]);

        return info.insertId;
}



export async function removerFavoritos(idUser, idFilme){
        const comando = `
        DELETE FROM favoritos 
        WHERE id_usuario = ? AND id_filme =  ?
        `;

        let [info] = await connection.query(comando, [
                idUser,
                idFilme
        ]);
        return info.affectedRows;

}




export async function contarFavoritos(){
        const comando = `
                SELECT favoritos.id_usuario, count(favoritos.id_usuario) AS TotalFavoritos FROM favoritos
                GROUP BY favoritos.id_usuario;
        `;

                let [info] = await connection.query(comando);
                return info;

}



