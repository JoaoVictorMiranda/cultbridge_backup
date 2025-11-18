import * as repo from '../repository/favoritosRepository.js'
import { Router } from 'express'
import { getAuthentication } from '../utils/jwt.js';


const auth = getAuthentication();

const endpoints = Router();


endpoints.post('/favoritos/:idFilme', auth, async (req, res) => {
        const idUser  = req.user.id_user;
        const idFilme =  req.params.idFilme;

        let info = await repo.favoritasFilme(idUser, idFilme);
        res.send({NovoId: info});
});



endpoints.delete('/favoritos/:idFilme', auth, async (req, res) => {
        const idUser  = req.user.id_user;
        const idFilme =  req.params.idFilme;
        
        let info = await repo.removerFavoritos(idUser, idFilme);
        
        res.send({LinhasAfetadas: info});
});




endpoints.get('/favoritos', auth, async (req, res) => {
        let info = await repo.contarFavoritos();
        res.send(info)

})






export default endpoints