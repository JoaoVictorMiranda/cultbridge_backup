import * as repo from '../repository/loginRepository.js'
import { Router } from 'express'
import { generateToken } from '../utils/jwt.js'

const endpoints = Router();

endpoints.post('/user/cadastro', async (req, res) => {
    try {
        let dados = req.body;

        let registro = await repo.inserirUsuario(dados);

        res.send({
            NovoId: registro
        })
    }

    catch (error) {
        res.status(401).send({
            'erro': error
        })
    }
})

endpoints.post('/usuario', async (req, res) => {
    let email = req.body.email;
    let senha = req.body.senha;

    let credenciais = await repo.loginUsuario(email, senha);

    if (!credenciais) {
        res.status(401).send({
            erro: 'Credenciais inválidas.'
        });
    }
    else {
        res.send({
            token: generateToken(credenciais)
        });
    }

})




export default endpoints