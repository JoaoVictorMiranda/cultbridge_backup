import { IoPerson } from "react-icons/io5";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../../api';
import Header from '../../components/Header';
import Footer from '../../components/Footer'
import DefinirTopico from '../../components/Topicos';
import ModalPostarComentario from '../../components/ModalPostarComentario';
import { Toaster, toast } from 'react-hot-toast'
import { CiSearch } from "react-icons/ci";
import "./index.scss"

const Comunidades = () => {
    let [nome, setNome] = useState();
    let [descricao, setDescricao] = useState();
    let [imagem, setImagem] = useState();
    const [modal, setModal] = useState(false)
    const [comunidadePerfil, setComunidadePerfil] = useState()
    const [busca, setBusca] = useState('')
    const [comunidade, setComunidade] = useState([])
    const navigate = useNavigate();

    const construirUrlFoto = (caminho) => {
        if (!caminho) return;
        if (caminho.startsWith('data:')) return caminho;
        if (caminho.startsWith('http')) return caminho;
        return `http://localhost:5022/${caminho}`;
    };

    useEffect(() => {
        let token = localStorage.getItem("token");

        if (!token) {
            toast.error('você não possui permissão para acesar esta pagina')
            navigate('/login')
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('nome', nome);
        formData.append('descricao', descricao);

        if (imagem) {
            formData.append('img', imagem);
        }

        if (!nome || !descricao) {
            toast.error('Não pode enviar campos vazios')
            return
        }

        try {
            await api.post('/comunidade', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            await PuxarComunidades()
            setModal(false)
        }

        catch (error) {
            console.error("Erro ao criar comunidade:", error);
            alert("Erro ao criar comunidade");
        }
    };

    async function PuxarComunidades() {
        const resp = await api.get('/comunidades/busca')
        setComunidade(resp.data.dados)
    }

    useEffect(() => {
        PuxarComunidades()
    }, [])

    async function PesquisarFilmes() {
        if (busca.trim().length === 0) {
            return PuxarComunidades()
        }

        const resp = await api.get(`/comunidades/pesquisar?busca=${busca}`)
        setComunidade(resp.data.dados)
    }

    useEffect(() => {
        PesquisarFilmes()
    }, [busca])

    function limitarTitulo(texto, limite = 22) {
        if (!texto) return '';
        return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
    }

    function limitarDesc(texto, limite = 29) {
        if (!texto) return '';
        return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
    }

    return (
        <div className='component-comuni'>

            <Header />
            <div className='ConteudoPaginaFilmes'>
                <DefinirTopico tema={'COMUNIDADES'} />

                <div className="TituloPesquisarFilmesDinamicos">
                    <div className="BarraPesquisa">
                        <h3><CiSearch style={{ color: 'white' }} /></h3>
                        <input type="text" placeholder='Pesquisar...' value={busca} onChange={(e => setBusca(e.target.value))}></input>
                    </div>
                    <button onClick={() => setModal(true)}>CRIAR COMUNIDADE</button>
                </div>
                <div className="ListarComunidades">
                    {
                        comunidade.map((comunidade) => (
                            <div key={comunidade.id_comunidade} className='BlocoComunidade' style={{ cursor: 'pointer' }} onClick={() => navigate(`/comunidade/${comunidade.id_comunidade}`)}>
                                <div className="FotoComunidade">
                                    <img src={
                                        construirUrlFoto(comunidade.foto_capa) ?
                                            construirUrlFoto(comunidade.foto_capa) :
                                            'Nenhuma foto'
                                    }
                                        alt="" />
                                </div>
                                <div className="Informacoes">
                                    <h4>{limitarTitulo(comunidade.nome)}</h4>
                                    <h5>{limitarDesc(comunidade.descricao) ? limitarDesc(comunidade.descricao) : 'Nenhuma descrição definida'}</h5>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <Footer />

            <ModalPostarComentario
                abrir={modal}
                setModal={() => setModal(!modal)}
                fechar={() => setModal(false)}
                tema={'Criar Comunidade'}
                salvar={handleSubmit}
                conteudo={
                    <div className="CriarComunidade">
                        <form className='infor-comuni' onSubmit={handleSubmit}>
                            <div className="Coluna">
                                <label id='Nome-comuni' htmlFor="nome">Nome da comunidade</label>
                                <input className='barrinha-aaa' type="text" name='nome' onChange={(e) => setNome(e.target.value)} required />
                            </div>
                            <div className="Coluna">
                                <label htmlFor="descricao">Descrição da comunidade</label>
                                <input
                                    className='barrinha-aaa'
                                    type="text"
                                    name='descricao'
                                    onChange={(e) => setDescricao(e.target.value)}
                                    required />
                            </div>
                            <div className="Coluna">
                                <label htmlFor="foto">Foto de capa da comunidade(optional)</label>
                                <input
                                    className='fotin-grupo'
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImagem(e.target.files[0])} />
                            </div>
                        </form>
                    </div>}
            />
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div >
    )
}

export default Comunidades