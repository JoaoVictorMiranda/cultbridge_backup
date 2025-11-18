import express from 'express'
import adicionarRotas from './rotas.js'
import cors from 'cors'

const api = express();



app.use(cors({
    origin: ['http://localhost:5173']
}));



api.use(express.json());


adicionarRotas(api)


api.get('/health', (req, res) => {

    res.status(200).json({
        status: 'OK',
        message: 'Servidor rodando',
        timestamp: new Date().toISOString()
    });
});




console.log(process.cwd());



const PORT = process.env.PORT;

api.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


