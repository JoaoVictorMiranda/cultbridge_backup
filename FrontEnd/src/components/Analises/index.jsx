import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import apiTMDB from '../../apiTMDB.js';
import api from '../../api.js';
import Profile from '../../assets/images/profile.jpg';
import { Toaster, toast } from 'react-hot-toast';
import CardComentario from '../CardComentario';
import DefinirTopico from '../Topicos/index.jsx';
import './index.scss';

const imageURL = import.meta.env.VITE_IMG;
const apiKey = import.meta.env.VITE_API_KEY;

export default function SessaoComentarios() {
    const [arr, setArr] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const navigate = useNavigate();

    async function PuxarInfo() {
        const token = localStorage.getItem('token')

        if (token) {
            const resp = await api.get('/post/avaliacao');
            setArr(resp.data.slice(0, 6));
        }

        if (!token) {
            const resp = await api.get('/post/avaliacao/deslogado')
            console.log(resp.data)
            setArr(resp.data.slice(0, 6))
        }
    }

    useEffect(() => {
        PuxarInfo();
    }, []);

    async function CurtirComentario(id_post) {
        const token = localStorage.getItem('token')
        if (!token) {
            toast.error('Precisa Logar')
            return
        }

        try {

            const resp = await api.post('/post/curtir', { id_post });
            return resp.data;
        }

        catch (err) {
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
            const decoded = jwtDecode(token);
            const userId = decoded.id_user || decoded.user?.id_user;

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

    return (
        <div className='SessaoComentarios'>
            <div className="SessaoComentariosConteudo">
                <DefinirTopico tema={'ANÁLISES RECENTES'} />

                <div className="ComentariosIsolados">
                    {arr.length ? (
                        arr.map((info) => (
                            <div key={info.id_post} className="ComentarioContainer">
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
                                    <div className="MenuComentario">
                                        <Link to={`/movie/${info.id_filme}`} className="MenuLink">
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
                    ) : (
                        <h1>Nenhuma análise encontrada</h1>
                    )}
                </div>
            </div>

            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div>
    );
}
