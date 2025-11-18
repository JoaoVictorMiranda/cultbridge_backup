import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import api from '../../api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DefinirTopico from '../../components/Topicos';
import CardMensagem from '../../components/Mensagem';
import { useNavigate } from 'react-router-dom';
import { FiMessageCircle } from "react-icons/fi";
import './index.scss'

const ChatComunidade = () => {
    const { id } = useParams();
    const [mensagens, setMensagens] = useState([]);
    const [mensagem, setMensagem] = useState('')
    const navigate = useNavigate();

    async function ListarMensagens() {
        const resp = await api.get(`/comunidade/chat/list/${id}`)
        setMensagens(resp.data)
    }

    useEffect(() => {
        ListarMensagens()
    }, [])

    async function inserirMensagem() {
        let body = {
            "mensagem": mensagem
        }

        if (!mensagem) {
            return
        }

        const resp = await api.post(`/comunidade/mensagem/${id}`, body)
        console.log(resp.data)

        await ListarMensagens()

        setMensagem('')
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        if (!token) {
            alert("Faça login primeiro");
            navigate('/login');
            return;
        }


    }, [id, navigate]);

    return (
        <div>
            <Header />

            <div className="ChatComunidade">

                <DefinirTopico
                    tema={'CHAT GERAL'} />

                <div className="ListarComentarios">
                    {
                        mensagens.map((m) => (
                            <div key={m.id_mensagem}>
                                <CardMensagem
                                    perfil={m.nome}
                                    id_user={m.id_user}
                                    analise={m.mensagem} />
                            </div>
                        ))
                    }
                </div>

                <div className="TituloPesquisarFilmesDinamicos">
                    <div className="BarraPesquisa">
                        <h3><FiMessageCircle style={{ color: 'white' }} /></h3>
                        <input
                            type="text"
                            placeholder='Mensagem...'
                            value={mensagem}
                            onChange={e => setMensagem(e.target.value)}
                        />
                    </div>
                    <button onClick={inserirMensagem}>Enviar</button>
                </div>

            </div>

            <Footer />
        </div>
    )
}

export default ChatComunidade;