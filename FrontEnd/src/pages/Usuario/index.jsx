import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import './index.scss';
import perfilFixo from '../../assets/images/usuario.png';
import Carregando from '../../components/Carregando';
import toast, { Toaster } from 'react-hot-toast';

const Usuario = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState({});
  const [fotoPerfil, setFotoPerfil] = useState(perfilFixo);
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState([]);
  const [qtdMostrar, setQtdMostrar] = useState(5);
  const [seguindo, setSeguindo] = useState(false);
  const [seguidores, setSeguidores] = useState([]);
  const [mostrarSeguidores, setMostrarSeguidores] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const construirUrlFoto = (caminho) => {
    if (!caminho) return perfilFixo;
    if (caminho.startsWith('data:')) return caminho;
    if (caminho.startsWith('http')) return caminho;
    return `http://localhost:5022/${caminho}`;
  };

  const calcularIdade = (dataISO) => {
    const hoje = new Date();
    const nascimento = new Date(dataISO);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
  };

  useEffect(() => {
    const verificarFollow = async () => {
      if (!token) return;
      try {
        const resp = await api.get(`/verificar-follow/${id}`, {
          headers: { 'x-access-token': token },
        });
        setSeguindo(resp.data.seguindo);
      } catch (err) {
        console.error('Erro ao verificar follow:', err);
      }
    };
    verificarFollow();
  }, [id, token]);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        setIsLoading(true);
        const resp = await api.get(`/user/${id}`, {
          headers: { 'x-access-token': token },
        });

        if (resp.status === 404) {
          toast.error('Usuário não encontrado');
          return navigate('/');
        }

        const info = resp.data.informacoes;
        if (info.nascimento) info.idade = calcularIdade(info.nascimento);

        setUsuario(info);
        setFotoPerfil(construirUrlFoto(info.foto_perfil));
      } catch (err) {
        toast.error('Erro ao carregar perfil');
      } finally {
        setIsLoading(false);
      }
    };
    carregarUsuario();
  }, [id, token, navigate]);

  useEffect(() => {
    const carregarPosts = async () => {
      try {
        const resp = await api.post(`/post/user/${id}`, {}, {
          headers: { 'x-access-token': token },
        });
        setPost(resp.data);
      } catch {
        setPost([]);
      }
    };
    carregarPosts();
  }, [id, token]);

  async function seguirUsuario() {
    if (!token) return toast.error('É necessário estar logado');
    try {
      if (seguindo) {
        await api.delete(`/unfollow/${id}`, { headers: { 'x-access-token': token } });
        setSeguindo(false);
        setUsuario((prev) => ({ ...prev, seguidores: Math.max((prev.seguidores || 1) - 1, 0) }));
        toast('Você deixou de seguir este usuário.');
      } else {
        await api.post(`/follow/${id}`, {}, { headers: { 'x-access-token': token } });
        setSeguindo(true);
        setUsuario((prev) => ({ ...prev, seguidores: (prev.seguidores || 0) + 1 }));
        toast.success('Agora você está seguindo este usuário!');
      }
    } catch {
      toast.error('Erro ao seguir/deixar de seguir usuário');
    }
  }

  const abrirSeguidores = async () => {
    try {
      const resp = await api.get(`/seguidores/${id}`, {
        headers: { 'x-access-token': token },
      });
      setSeguidores(resp.data);
      setMostrarSeguidores(true);
    } catch {
      toast.error('Erro ao carregar seguidores');
    }
  };

  const verMaisPosts = () => setQtdMostrar((prev) => Math.min(prev + 5, post.length));
  const postsParaMostrar = post.slice(0, qtdMostrar);

  return (
    <div>
      <Toaster />
      {isLoading && (
        <div className="overlay-carregando">
          <Carregando />
        </div>
      )}

      <div className="container_principal">
        <Header />

        <section className="container_infoUsuario">
          <div className="foto_perfil">
            <div className="imagem">
              <img src={fotoPerfil} alt="Foto de perfil" className="foto-perfil-img" />
            </div>
          </div>

          <div className="nome">
            <div className="only-name">
              <p>{usuario.nome || 'Usuário'}</p>
              <div className="editarPerfil">
                <button onClick={seguirUsuario}>
                  {seguindo ? 'Seguindo' : 'Seguir'}
                </button>
              </div>
            </div>

            <div className="infos">
              <div className="infosIndividuais">
                <p>{usuario.idade || '---'}</p>
                <h1>Idade</h1>
              </div>
              <div className="infosIndividuais" onClick={abrirSeguidores}>
                <p>{usuario.seguidores || '0'}</p>
                <h1>Seguidores</h1>
              </div>
              <div className="infosIndividuais">
                <p>{usuario.seguindo || '0'}</p>
                <h1>Seguindo</h1>
              </div>
            </div>
          </div>
        </section>

        <div className={`container_posts ${post.length === 0 ? 'vazio' : ''}`}>
          {post.length === 0 ? (
            <div className="sem-posts">
              <p>Este usuário ainda não publicou nenhuma análise</p>
            </div>
          ) : (
            postsParaMostrar.map((p) => (
              <div key={p.id_post} className="Card_post">
                <h2>{p.nome}</h2>
                <h3>{p.titulo}</h3>
                <p>Filme: {p.id_filme}</p>
                <p>Nota: {p.nota}</p>
                <p>Data: {p.criado_em.split('T')[0]}</p>
                <p>Curtidas: {p.curtidas}</p>
              </div>
            ))
          )}
        </div>

        {post.length > 5 && qtdMostrar < post.length && (
          <button className="button-ver-posts" onClick={verMaisPosts}>
            Ver todos os posts
          </button>
        )}

        <Footer />
      </div>

      {mostrarSeguidores && (
        <div className="overlay-seguidores">
          <div className="card-seguidores">
            <h2>Seguidores</h2>
            <ul>
              {seguidores.length === 0 ? (
                <li>Nenhum seguidor encontrado</li>
              ) : (
                seguidores.map((s) => <li key={s.id_user}>{s.nome}</li>)
              )}
            </ul>
            <button onClick={() => setMostrarSeguidores(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuario;
