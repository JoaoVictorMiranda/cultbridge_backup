import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./index.scss";
import api from "../../api.js";
import Header from "../../components/Header/index.jsx";
import Footer from "../../components/Footer/index.jsx";

const Registrar = () => {
  const [nome, setNome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const anoAtual = new Date().getFullYear();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dominiosPermitidos = [
      "gmail.com",
      "hotmail.com",
      "outlook.com",
      "yahoo.com",
      "icloud.com",
      "live.com",
      "bol.com.br",
      "uol.com.br",
      "terra.com.br",
    ];

    const dominioEmail = email.split("@")[1]?.toLowerCase();

    if (!dominiosPermitidos.includes(dominioEmail)) {
      alert("Por favor, use um e-mail válido como Gmail, Hotmail, Outlook, Yahoo, iCloud, etc.");
      return;
    }

    try {
      const response = await api.post("/user/cadastro", {
        nome,
        nascimento,
        email,
        senha,
      });

      console.log("Cadastro realizado com sucesso:", response.data);

      const loginResponse = await api.post("/usuario", { email, senha });
      const token = loginResponse.data.token;
      localStorage.setItem("token", token);
      navigate("/perfil");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao cadastrar:", error.response?.data || error.message);
      alert("Erro: este email já está cadastrado");
    }
  };

  return (
    <div className="container_registro">
      <Header />
      <div className="registro">
        <h1>Crie Sua Conta:</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            placeholder="Seu Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label htmlFor="nascimento">Data de Nascimento:</label>
          <input
            type="date"
            id="nascimento"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
            min="1900-01-01"
            max={`${anoAtual}-12-31`}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="senha">Senha:</label>
          <div className="input-senha">
            <input
              type={mostrarSenha ? "text" : "password"}
              id="senha"
              placeholder="Senha forte"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn-olho"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit">Registrar</button>
        </form>

        <p>
          Já tem login? <Link to="/login">Entrar</Link>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Registrar;
