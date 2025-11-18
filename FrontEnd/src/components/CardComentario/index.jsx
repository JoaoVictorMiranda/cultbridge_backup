import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import foto_perfil from "../../assets/images/profile.jpg";
import "./index.scss";
import api from '../../api.js'
import { jwtDecode } from 'jwt-decode';

export default function CardComentario({ id_post, id_user, perfil, nota, analise, curtidasIniciais, CliqueCurtir, usuarioCurtiu }) {
    const [curtidas, setCurtidas] = useState(curtidasIniciais || 0);
    const [curtido, setCurtido] = useState(usuarioCurtiu || false);
    const [fotoPerfil, setFotoPerfil] = useState(foto_perfil);
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    const construirUrlFoto = (caminho) => {
        if (!caminho) return foto_perfil;
        if (caminho.startsWith('data:')) return caminho;
        if (caminho.startsWith('http')) return caminho;
        return `http://localhost:5022/${caminho}`;
    };

    async function carregarFoto() {
        try {
            const res = await api.get(`/user/${id_user}`, {
                headers: { 'x-access-token': token }
            });
            if (res.data.informacoes.foto_perfil) {
                setFotoPerfil(construirUrlFoto(res.data.informacoes.foto_perfil));
            }
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
        }
    }

    useEffect(() => {
        carregarFoto();
    }, [id_user]);

    async function handleCurtir() {
        const resultado = await CliqueCurtir(id_post);
        if (resultado.liked) {
            setCurtidas(c => c + 1);
            setCurtido(true);
        } else {
            setCurtidas(c => c - 1);
            setCurtido(false);
        }
    }

    function IrParaPerfil() {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id_user || decoded.user?.id_user;
        if (userId === id_user) {
            navigate(`/perfil`);
        } else {
            navigate(`/perfil/${id_user}`);
        }
    }

    return (
        <div className="CardComentario">
            <div className="FotoPerfil">
                <img
                    onClick={IrParaPerfil}
                    style={{ cursor: 'pointer' }}
                    height={60}
                    src={fotoPerfil ? fotoPerfil : 'foto_perfil'}
                    alt=""
                />
            </div>
            <div className="AlinhadorComentario">
                <div className="Perfil">
                    <h3>{perfil}</h3>

                    <h3> - NOTA: {nota ?? ""}</h3>
                </div>
                <div className="Analise">
                    <h4>{analise}</h4>
                </div>
                <div className="Curtidas">
                    {curtido ? (
                        <FaHeart
                            color="red"
                            style={{ fontSize: 25, cursor: "pointer" }}
                            onClick={handleCurtir}
                        />
                    ) : (
                        <CiHeart
                            style={{ fontSize: 25, cursor: "pointer" }}
                            onClick={handleCurtir}
                        />
                    )}
                    <h4 style={{ paddingLeft: 5 }}>{curtidas}</h4>
                </div>
            </div>
        </div>
    );
}