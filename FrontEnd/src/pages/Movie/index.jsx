import Header from '../../components/Header'
import Footer from '../../components/Footer'
import CardDetalhes from '../../components/CardInfo/index.jsx';
import Carregando from '../../components/Carregando/index.jsx';
import CardComentario from '../../components/CardComentario/index.jsx';
import ModalPostarComentario from '../../components/ModalPostarComentario/index.jsx';
import DefinirTopico from '../../components/Topicos/index.jsx';
import { Toaster, toast } from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import { useState, useEffect } from 'react';
import apiTMDB from '../../apiTMDB.js';
import api from '../../api.js';
import './index.scss'
import { FaEye } from "react-icons/fa";

const imageURL = import.meta.env.VITE_IMG;
const apiKey = import.meta.env.VITE_API_KEY;

export default function Index() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [diretor, setDiretor] = useState('');
    const [modal, setModal] = useState(false)
    const [media, setMedia] = useState(null);
    const [count, setCount] = useState(0)
    const [arr, setArr] = useState([]);
    const [avaliacao, setAvaliacao] = useState('');
    const [nota, setNota] = useState('')

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await apiTMDB.get(`/movie/${id}?${apiKey}&language=pt-BR`);
                setMovie(response.data);
            } catch (err) {
                console.error('Erro fetchMovie:', err);
            }
        };
        fetchMovie();
    }, [id]);

    useEffect(() => {
        const AcharDiretor = async () => {
            try {
                const resp = await apiTMDB.get(`/movie/${id}/credits?${apiKey}&language=pt-BR`)
                const elenco = resp.data.crew || [];
                const diretorObj = elenco.find(p => p.job === 'Director')
                setDiretor(diretorObj ? diretorObj.name : 'Desconhecido')
            } catch (err) {
                console.error('Erro AcharDiretor:', err);
                setDiretor('Desconhecido')
            }
        }
        AcharDiretor();
    }, [id])

    useEffect(() => {
        async function BuscarMedia() {
            try {
                const resp = await api.get(`/post/media/${id}`)
                if (resp.data && resp.data.media && resp.data.media[0]) {
                    setMedia(String(resp.data.media[0].MediaCurtidas).split(".")[0])
                } else {
                    setMedia('0')
                }
            } catch (err) {
                console.error('Erro BuscarMedia:', err);
                setMedia('0')
            }
        }
        BuscarMedia();
        BuscarInfo();
    }, [id])

    useEffect(() => {
        async function BuscarQuantidadeAnalises() {
            try {
                const resp = await api.get(`/post/count/${id}`)
                if (resp.data && resp.data.contagem && resp.data.contagem[0]) {
                    setCount(resp.data.contagem[0].ContarAvaliacao || 0)
                } else {
                    setCount(0)
                }
            } catch (err) {
                console.error('Erro BuscarQuantidadeAnalises:', err);
                setCount(0)
            }
        }
        BuscarQuantidadeAnalises()
    }, [id])

    async function BuscarInfo() {
        try {
            const token = localStorage.getItem('token')
            if (token) {
                const resp = await api.get(`/post/${id}`)
                setArr(resp.data.Info || resp.data || [])
            } else {
                const resp = await api.get(`/post/deslogado/${id}`)
                setArr(resp.data.Info || resp.data || [])
            }
        } catch (err) {
            console.error('Erro BuscarInfo:', err);
            setArr([])
        }
    }

    async function CurtirComentario(id_post) {
        const token = localStorage.getItem('token')
        if (!token) {
            toast.error('Precisa logar')
            return
        }

        try {
            const resp = await api.post('/post/curtir', { id_post });
            return resp.data
        } catch (err) {
            console.error(err);
            return { liked: false };
        }
    }

    const handleOpenMenu = (id_post) => {
        setOpenMenuId(openMenuId === id_post ? null : id_post);
    };

    function IrParaPerfil(id_user_comentario) {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate(`/perfil/${id_user_comentario}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const decoded = jwtDecode(token);
            const userId = decoded.id_user || decoded.user?.id_user || decoded.id;

            if (userId === id_user_comentario) {
                navigate(`/perfil`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                navigate(`/perfil/${id_user_comentario}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            console.error("Erro ao navegar para o perfil:", err);
            navigate(`/perfil/${id_user_comentario}`);
        }
    }

    async function EnviarAvaliacao() {
        if (!avaliacao || !nota) {
            toast.error('Erro ao enviar análise!')
            return
        }

        try {
            const body = {
                id_filme: id,
                avaliacao: avaliacao,
                nota: nota
            }

            toast.success('Análise Enviada com Sucesso!')

            await api.post('/EnviarComentario', body)
            setModal(false)

            setAvaliacao('')
            setNota('')

            await BuscarInfo()
            await BuscarMedia()
        } catch (err) {
            console.log(err)
            return
        }
    }

    if (!movie) return <Carregando />;

    return (
        <div>
            <Header />

            <div className="DetalhesDaObra">
                <div className="AlinhadorDetalhes">
                    <div className="DetalhesConteudo">
                        <h1>{movie.title}</h1>
                        <h3>{movie.release_date ? movie.release_date.split('-')[0] : ''}</h3>
                    </div>
                    <div className="Trailer">
                        <button onClick={() => setModal(true)}>REGISTRAR</button>
                    </div>
                </div>
            </div>

            <div className="PosterSinopse">
                <img id='BackgroungDoFilme' src={imageURL + movie.backdrop_path} alt="" />
                <div className='EspacoDetalhes'>
                    <div className="PosterEsquerda">
                        <img width={250} src={imageURL + movie.poster_path} alt={movie.title} />
                    </div>
                    <div className="DetalhesAlinhador">
                        <div className="Diretor">
                            <h1>DIRIGIDO POR</h1>
                            <h3>{diretor}</h3>
                        </div>
                        <div className="Information">
                            <CardDetalhes
                                Quantidade={`${media ? media : '0'}`}
                                Info={'Aproveitamento'} />
                            <CardDetalhes
                                Quantidade={`${count ? count : '0'}`}
                                Info={'Análises'} />
                        </div>
                        <div className='Sinopse'>
                            <p>{movie.overview}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="SessaoComentarios">
                <div className="OsComentarios">
                    <DefinirTopico tema={'ANÁLISES'} />
                    {
                        arr && arr.length >= 1 ?
                            arr.map((info) => (
                                <div className="Comentarios" key={info.id_post}>
                                    <div onClick={() => handleOpenMenu(info.id_post)}>
                                        <CardComentario
                                            id_post={info.id_post}
                                            perfil={info.nome}
                                            analise={info.avaliacao}
                                            curtidasIniciais={info.curtidas}
                                            nota={info.nota}
                                            CliqueCurtir={CurtirComentario}
                                            usuarioCurtiu={info.usuario_curtiu}
                                            id_user={info.id_user}
                                        />
                                    </div>

                                    {openMenuId === info.id_post && (
                                        <div className="MenuComentarioMovie">
                                            <Link to={`/movie/${info.id_filme}`} className="MenuLinks">
                                                Ver Filme
                                            </Link>

                                            <a
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    IrParaPerfil(info.id_user);
                                                }}
                                                className="MenuLink"
                                            >
                                                Ver Perfil
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))
                            :
                            <h2 style={{ textAlign: 'center' }}>Nenhuma análise encontrada</h2>
                    }
                </div>
            </div>

            <Footer />

            <ModalPostarComentario
                abrir={modal}
                setModal={() => setModal(!modal)}
                fechar={() => setModal(false)}
                tema={'Adicionar Análise'}
                salvar={EnviarAvaliacao}
                conteudo={
                    <div className='Modal'>
                        <label style={{ fontWeight: '500' }}>Avaliação</label>
                        <input type='text' value={avaliacao} onChange={e => setAvaliacao(e.target.value)} />
                        <label style={{ fontWeight: '500' }}>Nota</label>
                        <input
                            type="number"
                            value={nota}
                            onChange={e => {
                                const valor = Number(e.target.value);
                                if (valor > 5) setNota(5);
                                else if (valor < 1) setNota(1);
                                else setNota(valor);
                            }}
                        />
                    </div>
                }
            />

            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div>
    )
}
