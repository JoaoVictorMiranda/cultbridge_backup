import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import './index.scss';
import perfilFixo from '../../assets/images/usuario.png';
import Carregando from '../../components/Carregando';
import toast, { Toaster } from 'react-hot-toast';
import apiTMDB from '../../apiTMDB';
const apiKey = import.meta.env.VITE_API_KEY;

const Perfil = () => {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(perfilFixo);
  const [seguidores, setSeguidores] = useState(0);
  const [seguindo, setSeguindo] = useState(0);
  const [listaSeguidores, setListaSeguidores] = useState([]);
  const [mostrarSeguidores, setMostrarSeguidores] = useState(false);
  const [meusSeguidores, setMeusSeguidores] = useState([]);
  const [mostrarMeusSeguidores, setMostrarMeusSeguidores] = useState(false);
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [qtdMostrar, setQtdMostrar] = useState(5);
  const [nomesFilmes, setNomesFilmes] = useState({}); 

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();
  const decodedToken = token ? jwtDecode(token) : null;
  const userIdLogado = decodedToken?.id_user || decodedToken?.user?.id_user;

  const construirUrlFoto = (caminho) => {
    if (!caminho) return perfilFixo;
    if (caminho.startsWith('data:')) return caminho;
    if (caminho.startsWith('http')) return caminho;
    return `http://localhost:5022/${caminho}`;
  };

  useEffect(() => {
    if (!token) return;

    const carregarTudo = async () => {
      try {

        const userIdPerfil = id || userIdLogado;
        const res = await api.get(`/user/${userIdPerfil}`, {
          headers: { 'x-access-token': token },
        });
        const user = res.data.informacoes;
        setNome(user.nome);
        if (user.nascimento) setIdade(calcularIdade(user.nascimento));
        setFotoPerfil(construirUrlFoto(user.foto_perfil));
        setSeguidores(user.seguidores || 0);
        setSeguindo(user.seguindo || 0);


        await carregarPost();
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      }
    };

    carregarTudo();
  }, [token, id]);

  async function carregarPost() {
    try {
      const res = await api.post('/post/user', {}, {
        headers: { 'x-access-token': token },
      });

      const postsRecebidos = res.data || [];
      setPost(postsRecebidos);

     
      const nomes = {};
      await Promise.all(postsRecebidos.map(async (postItem) => {
        if (!postItem.id_filme) return;
        try {
          const response = await apiTMDB.get(
            `/movie/${postItem.id_filme}?${apiKey}&language=pt-BR`
          );
          nomes[postItem.id_filme] = response.data.title;
        } catch (error) {
          console.error('Erro ao buscar nome do filme:', error);
          nomes[postItem.id_filme] = 'Desconhecido';
        }
      }));

      setNomesFilmes(nomes);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    }
  }

  function calcularIdade(dataISO) {
    const hoje = new Date();
    const nascimento = new Date(dataISO);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
  }

  async function handleDeslogar() {
    setIsLoading(true);
    toast.success("Deslogado - Volte Sempre!", { duration: 3000, position: 'top-center' });
    setTimeout(() => {
      localStorage.removeItem("token");
      setIsLoading(false);
      navigate('/');
      window.location.reload();
    }, 3000);
  }

  const verPosts = () => setQtdMostrar(prev => Math.min(prev + 5, post.length));
  const postsParaMostrar = post.slice(0, qtdMostrar);


  async function carregarSeguidores(userIdParam) {
    try {
      const res = await api.get(`/seguidores/${userIdParam}`, {
        headers: { 'x-access-token': token },
      });
      setListaSeguidores(res.data.seguidores || res.data);
      setMostrarSeguidores(true);
    } catch (error) {
      console.error('Erro ao carregar seguidores:', error.response?.data || error.message);
    }
  }

  async function carregarMeusSeguidores() {
    try {
      const res = await api.get('/user/seguidores', {
        headers: { 'x-access-token': token },
      });
      setMeusSeguidores(res.data.seguidores || res.data);
      setMostrarMeusSeguidores(true);
    } catch (error) {
      console.error('Erro ao carregar meus seguidores:', error.response?.data || error.message);
    }
  }



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

        <section className='container_infoUsuario'>
          <div className="foto_perfil">
            <div className='imagem'>
              <img
                src={fotoPerfil}
                alt="Foto de perfil"
                className="foto-perfil-img"
                onError={(e) => { e.target.src = perfilFixo; }}
              />
            </div>
          </div>

          <div className="nome">
            <div className="only-name">
              <p>{nome}</p>
              <div className="editarPerfil">
                <Link to="/perfil/configurar" className="menu-link">Editar Foto</Link>
              </div>
            </div>

            <div className="infos">
              <div className="infosIndividuais">
                <p>{idade}</p>
                <h1>Idade</h1>
              </div>

              <div className="infosIndividuais">
                <p onClick={() => carregarSeguidores(id || userIdLogado)} style={{ cursor: 'pointer' }}>
                  {seguidores}
                </p>
                <h1>Seguidores</h1>
              </div>

              <div className="infosIndividuais">
                <p>{seguindo}</p>
                <h1>Seguindo</h1>
              </div>
            </div>
          </div>
        </section>

        <div className={`container_posts ${post.length === 0 ? 'vazio' : ''}`}>
          {post.length === 0 ? (
            <div className="sem-posts">
              <p>Você ainda não publicou nenhuma análise</p>
            </div>
          ) : (
            postsParaMostrar.map((postItem) => (

              <div key={postItem.id_post} className="Card_post" onClick={() => navigate(`/movie/${postItem.id_filme}`)} >
                <h2>{postItem.nome}</h2>
                <h3>{postItem.titulo}</h3>
                <p>Filme: {nomesFilmes[postItem.id_filme] || 'Carregando...'}</p>
                <p>Nota: {postItem.nota}</p>
                <p>Data: {postItem.criado_em.split('T')[0]}</p>
                <p>Curtidas: {postItem.curtidas}</p>
              </div>

            ))
          )}
        </div>

        {post.length > 5 && qtdMostrar < post.length && (
          <button className="button-ver-posts" onClick={verPosts}>
            Ver todos os posts
          </button>
        )}
      </div>

      <Footer />

      {mostrarSeguidores && (
        <div className="overlay-seguidores">
          <div className="card-seguidores">
            <h2>Seguidores do meu Perfil</h2>
            <ul>
              {listaSeguidores.length === 0 ? (
                <li>Nenhum seguidor encontrado</li>
              ) : (
                listaSeguidores.map(seguidor => (
                  <li key={seguidor.id_user}>{seguidor.nome}</li>
                ))
              )}
            </ul>
            <button onClick={() => setMostrarSeguidores(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
