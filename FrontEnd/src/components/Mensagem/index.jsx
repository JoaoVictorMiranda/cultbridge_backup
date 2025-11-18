import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import foto_perfil from "../../assets/images/profile.jpg";
import "./index.scss";
import api from '../../api.js'
import { jwtDecode } from 'jwt-decode';

export default function CardMensagem({ id_user, perfil, nota, analise }) {
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

    function IrParaPerfil() {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id_user || decoded.user?.id_user;
        if (userId === id_user) {
            navigate(`/perfil`);
        }

        else {
            navigate(`/perfil/${id_user}`);
        }
    }

    return (
        <div className="MensagemComentario">
            <div className="FotoPerfilMensagem">
                <img
                    onClick={IrParaPerfil}
                    style={{ cursor: 'pointer' }}
                    height={60}
                    src={fotoPerfil ? fotoPerfil : 'foto_perfil'}
                    alt=""
                />
            </div>
            <div className="AlinhadorMensagem">
                <div className="Perfil">
                    <h3>{perfil}</h3>
                </div>
                <div className="Analise">
                    <h4>{analise}</h4>
                </div>
            </div>
        </div>
    );
}