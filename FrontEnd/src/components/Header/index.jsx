import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Carregando from '../../components/Carregando';
import Barras from '../../assets/images/barras.svg';
import Pesquisa from '../../assets/images/pesquisa.svg';
import habuge from '../../assets/images/habuge.svg';
import clickSound from '../../assets/audios/click.mp3';

import './index.scss';

export default function Header() {
    const [nome, setNome] = useState('');
    const [mostrarCampo, setMostrarCampo] = useState(false);
    const [iconeMenu, setIconeMenu] = useState(Barras);
    const [textoBusca, setTextoBusca] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);
    const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const menuPerfilRef = useRef(null);
    const audioRef = useRef(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const nomeUsuario = decoded.nome || decoded.user?.nome || '';
                setNome(nomeUsuario);
            } catch (error) {
                console.error('Token inválido ou expirado:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuPerfilRef.current && !menuPerfilRef.current.contains(event.target)) {
                setMenuPerfilAberto(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function alternarMenu() {
       
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(error => {
                console.log('Erro ao reproduzir áudio:', error);
            });
        }
        
        setMenuAberto(!menuAberto);
        setIconeMenu(menuAberto ? Barras : habuge);
    }

    function alternarMenuPerfil() {
        setMenuPerfilAberto(!menuPerfilAberto);
    }

    function fecharMenu() {
        setMenuAberto(false);
        setIconeMenu(Barras);
    }

    function fecharMenuPerfil() {
        setMenuPerfilAberto(false);
    }

    function abrirBusca() {
        setMostrarCampo(true);
        setIsFocused(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    }

    function buscarFilme(evento) {
        if (evento.key === 'Enter' && textoBusca.trim()) {
            setIsLoading(true);
            setTimeout(() => {
                navigate(`/buscainformacoes?query=${encodeURIComponent(textoBusca)}`);
                setMostrarCampo(false);
                setIsFocused(false);
                fecharMenu();
                setIsLoading(false);
            }, 1000);
        }
    }

    function pesquisa() {
        abrirBusca();
    }

    function handleLinkClick() {
        fecharMenu();
        fecharMenuPerfil();
    }

    function handleLogout() {
        setIsLoading(true);
        setMenuPerfilAberto(false);
        
        setTimeout(() => {
            localStorage.removeItem('token');
            setNome('');
            setIsLoading(false);
            navigate('/');
        }, 1500);
    }

    return (
        <header className="container_header">
            {isLoading && (
                <div className="overlay-carregando">
                    <Carregando />
                </div>
            )}

            <div className="menu_hamburguer">
                <img
                    src={iconeMenu}
                    alt="Menu"
                    onClick={alternarMenu}
                    className="hamburguer"
                />
            </div>

            <audio ref={audioRef} preload="auto">
                <source src={clickSound} type="audio/mpeg" />
                Seu navegador não suporta o elemento de áudio.
            </audio>

            {menuAberto && <div className="overlay" onClick={fecharMenu}></div>}

            <nav className={`container_nav ${menuAberto ? 'menu_aberto' : ''}`}>
                <ul>
                    <li><Link to="/" onClick={handleLinkClick}>INÍCIO</Link></li>
                    <li><Link to="/filmes" onClick={handleLinkClick}>FILMES</Link></li>
                    <li><Link to="/comunidade" onClick={handleLinkClick}>COMUNIDADE</Link></li>
                </ul>
            </nav>

            <div className="header_login">
                {isFocused && <div className="overlay" onClick={() => setIsFocused(false)}></div>}
                
                <div className="caixa_pesquisa">
                    <input
                        ref={inputRef}
                        type="text"
                        value={textoBusca}
                        onChange={(e) => setTextoBusca(e.target.value)}
                        onKeyDown={buscarFilme}
                        placeholder="Buscar filme..."
                        className={`input_pesquisa ${mostrarCampo ? '' : 'sumido'}`}
                        onBlur={() => {
                            setTimeout(() => {
                                setMostrarCampo(false);
                                setIsFocused(false);
                            }, 200);
                        }}
                    />
                </div>
                
                <img 
                    src={Pesquisa} 
                    alt="Pesquisar" 
                    className='pesquisa' 
                    onClick={pesquisa} 
                />
                
                {nome ? (
                    <div className="container_perfil" ref={menuPerfilRef}>
                        <div 
                            className="perfil_trigger"
                            onClick={alternarMenuPerfil}
                        >
                            <span className="nome_usuario">{nome}</span>
                        </div>
                        
                        {menuPerfilAberto && (
                            <div className="menu_perfil">
                                <div className="perfil_info">
                                    <span className="nome_perfil_menu">{nome}</span>
                                </div>
                                
                                <div className="divisor"></div>
                                
                                <Link 
                                    to="/perfil" 
                                    className="menu_item"
                                    onClick={handleLinkClick}
                                >
                                    Acessar Perfil
                                </Link>
                                
                                <button 
                                    className="menu_item logout"
                                    onClick={handleLogout}
                                >
                                    Deslogar
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" onClick={fecharMenu}>
                        <h3>Logar</h3>
                    </Link>
                )}
            </div>
        </header>
    );
}