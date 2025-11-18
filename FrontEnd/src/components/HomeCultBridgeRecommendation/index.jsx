import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import apiTMDB from '../../apiTMDB.js'
const imageURL = import.meta.env.VITE_IMG;
const apiKey = import.meta.env.VITE_API_KEY;

import './index.scss'
import DefinirTopico from '../Topicos/index.jsx';

export default function index() {
    const [movie, setMovie] = useState(null)
    const [diretor, setDiretor] = useState('')
    const [recomendados, setRecomendados] = useState([])
    const [outros, setOutros] = useState([])
    const navigate = useNavigate()

    async function ListaRecomendados() {
        const resp = await apiTMDB.get(`/movie/now_playing?${apiKey}&language=pt-BR`)
        setRecomendados(resp.data.results.slice(0,8))
    }

    async function OutrasOpcoes() {
        const resp = await apiTMDB.get(`movie/popular?${apiKey}&language=pt-BR`)
        setOutros(resp.data.results.slice(0,8))
    }

    ListaRecomendados()
    OutrasOpcoes()

    return (
        <div className='HomeAbaRecomendados'>
            <DefinirTopico
                tema={'EXPLORAR'} />

            <h1 id='FilmesRecomendados'>Filmes Recomendados</h1>
            <div className="BannersExibicao">
                {
                    recomendados.map((filme) => (
                        <div key={filme.id}>
                            <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} 
                            onClick={() => navigate(`movie/${filme.id}`)}/>
                        </div>
                    ))
                }
            </div>

            <h1 id='FilmesRecomendados'>Outras opções</h1>
            <div className="BannersExibicao">
                {
                    outros.map((filme) => (
                        <div key={filme.id}>
                            <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
                            onClick={() => navigate(`movie/${filme.id}`)}/>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}
