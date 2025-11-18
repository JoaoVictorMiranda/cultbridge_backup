import { useEffect, useState } from 'react';

import apiTMDB from '../../apiTMDB'

const apiKey = import.meta.env.VITE_API_KEY;

import './index.scss'

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import DefinirTopico from '../../components/Topicos';
import { useNavigate } from 'react-router';
import { CiSearch } from "react-icons/ci";

export default function Filmes() {
    const [filmes, setFilmes] = useState([])
    const [busca, setBusca] = useState('')
    const navigate = useNavigate()

    async function CarregarFilmes() {
        const resp = await apiTMDB.get(`/movie/now_playing?${apiKey}&language=pt-BR`)
        setFilmes(resp.data.results.slice(0, 20))
    }

    async function PesquisarFilmes() {
        if (busca.trim().length === 0) {
            CarregarFilmes()
            return
        }

        const resp = await apiTMDB.get(`search/movie?${apiKey}&language=pt-BR&query=${busca}`)
        setFilmes(resp.data.results)
    }

    useEffect(() => {
        PesquisarFilmes()
    }, [busca])

    return (
        <div>
            <Header />
            <div className='ConteudoPaginaFilmes'>
                <DefinirTopico tema={'EXPLORAR'} />

                <div className="TituloPesquisarFilmesDinamicos">
                    <div className="BarraPesquisa">
                        <h3><CiSearch style={{ color: 'white' }} /></h3>
                        <input type="text" placeholder='Pesquisar...' value={busca} onChange={(e => setBusca(e.target.value))}></input>
                    </div>
                    <button>TODOS OS GÊNEROS</button>
                </div>

                <div className="CentralizadorPaginaFilmes">

                    <div className="ListaPaginaFilmes">
                        {
                            filmes.map((filme) => (
                                <div key={filme.id}>
                                    <img
                                        width={100}
                                        src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} alt=""
                                        onClick={() => navigate(`/movie/${filme.id}`)}
                                        style={{ cursor: 'pointer' }} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}