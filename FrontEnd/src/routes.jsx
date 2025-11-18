import { Routes, Route, BrowserRouter } from "react-router"

import Home from "./pages/home"
import Login from "./pages/login"
import Registrar from "./pages/registro"
import Perfil from "./pages/perfil"
import NotFound from "./pages/notfound"
import MoviePage from './pages/Movie'
import ConfigurarPerfil from "./pages/configurarPerfil"
import LoginAdmin from "./pages/loginAdmin"
import Buscar from './pages/BuscaInformacoes'
import Grafico from './pages/ChartJS'
import ExibirFilmes from './pages/Filmes'
import Comunidades from "./pages/comunidades"
import ChatComunidade from "./pages/comunidade_chat"
import Desenvolvedores from "./pages/desenvolvedores"
import PerfilUsuario from './pages/Usuario'
import Privacidade from "./pages/politicas/PoliticasPrivacidade"

const Navegacao = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login/adminlo0gin" element={<LoginAdmin />} />
        <Route path='/movie/:id' element={<MoviePage />} />
        <Route path='/perfil/configurar' element={<ConfigurarPerfil />} />
        <Route path='/buscainformacoes' element={<Buscar />} />
        <Route path="/adminChart" element={<Grafico />} />
        <Route path='/filmes' element={<ExibirFilmes />} />
        <Route path="/comunidade" element={<Comunidades />} />
        <Route path="/comunidade/:id" element={<ChatComunidade />}/>
        <Route path="/desenvolvedores" element={<Desenvolvedores />}/>
        <Route path='/perfil/:id' element={<PerfilUsuario/>}/>
        <Route path="/privacidade" element={<Privacidade/>}/>


        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

  )
}

export default Navegacao