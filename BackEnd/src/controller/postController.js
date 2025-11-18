import * as repo from '../repository/postRepository.js'
import { Router } from 'express'
import { getAuthentication } from '../utils/jwt.js'

const auth = getAuthentication();


const endpoints = Router();


endpoints.post('/EnviarComentario', auth, async (req, res) => {
    let dados = req.body;
    let idUser = req.user.id_user;

    let post = await repo.criarPost(dados, idUser);
    res.send({ novoPost: post });
})

endpoints.get('/post', auth, async (req, res) => {
    let info = await repo.listarPostPorFilme();

    res.send(info)

})

endpoints.get('/post/avaliacao', auth, async (req, resp) => {
    try {
        const id_user = req.user.id_user;

        const resposta = await repo.listarAvaliacoesRecentes(id_user);

        resp.send(resposta);
    }

    catch (err) {
        console.error(err);
        resp.status(500).send({ erro: "Erro ao buscar análises recentes" });
    }
});

endpoints.get('/post/avaliacao/deslogado', async (req, resp) => {
    try {
        const resposta = await repo.listarAvaliacoesRecentesDeslogado();

        resp.send(resposta);
    }

    catch (err) {
        console.error(err);
        resp.status(500).send({ erro: "Erro ao buscar análises recentes" });
    }
});

endpoints.get('/post/media/:id_filme', auth, async (req, resp) => {
    let id_filme = req.params.id_filme;

    const resposta = await repo.MediaCurtidas(id_filme)
    resp.send({ media: resposta })
})

endpoints.get('/post/count/:id_filme', auth, async (req, resp) => {
    let id_filme = req.params.id_filme;

    const resposta = await repo.ContagemComentarios(id_filme)
    resp.send({ contagem: resposta })
})

endpoints.post('/post/user', auth, async (req, res) => {
    let idUser = req.user.id_user;

    let info = await repo.listarPostPorUsuario(idUser);
    res.send(info)
})


endpoints.get('/post/:id_filme', auth, async (req, resp) => {
    try {
        const id_filme = req.params.id_filme;
        const id_user = req.user.id_user;

        const resposta = await repo.listarPostPorIdFilme(id_filme, id_user);

        resp.send({ Info: resposta });
    }

    catch (err) {
        console.error(err);
        resp.status(500).send({ erro: "Erro ao buscar comentários" });
    }
});

endpoints.get('/post/deslogado/:id_filme', async (req, resp) => {
    try {
        const id_filme = req.params.id_filme;
        const resposta = await repo.listarPostPorIdFilmeDeslogado(id_filme);

        resp.send({ Info: resposta });
    }

    catch (err) {
        console.error(err);
        resp.status(500).send({ erro: "Erro ao buscar comentários" });
    }
});

endpoints.post('/VerSeCurtiu', auth, async (req, resp) => {
    const id = req.user.id_user;

    const registro = await repo.VerSeCurtiu(id)
    resp.send(registro);
})

endpoints.post('/post/curtir', auth, async (req, res) => {
    let idPost = req.body.id_post;
    let idUser = req.user.id_user;

    let info = await repo.curtirPost(idUser, idPost);
    res.send(info);
})

export default endpoints