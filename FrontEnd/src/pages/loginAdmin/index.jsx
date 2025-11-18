import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './index.scss'
import api from '../../api';

const LoginAdmin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        api.post('/usuario', {
            email: email,
            senha: senha
        })
            .then(response => {
                console.log(response.data);
                const token = response.data.token
                localStorage.setItem("token", token)
                navigate('/adminchart')
            })
            .catch(error => {
                console.error('Deu merda:', error);
            });
    };

    const handleVoltar = () => {
        navigate('/');
    };

    return (
        <div className="painel-login">
            <Header />

            <form onSubmit={handleSubmit} className="formulario-login">
                <h1>Admin</h1>

                <div className="grupo-input">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="seu@email.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="grupo-input">
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Sua senha"
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>

                <div className="links-ajuda">
                    <Link to="/forgot-password">Esqueceu a senha?</Link>
                    <Link to="/registrar">Criar conta</Link>
                </div>

                <button type="submit" className="botao-login">
                    Entrar
                </button>

                <button type="button" onClick={handleVoltar} className="botao-retorno">
                    Voltar ao Início
                </button>
            </form>
            <Footer />
        </div>
    )
}

export default LoginAdmin;
