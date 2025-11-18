import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiTMDB from '../../apiTMDB.js';
import './index.scss';
import Carregando from '../Carregando/index.jsx';

const imageURL = import.meta.env.VITE_IMG;
const apiKey = import.meta.env.VITE_API_KEY;

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            const response = await apiTMDB.get(`/movie/${id}?${apiKey}&language=pt-BR`);
            setMovie(response.data);
        };
        fetchMovie();
    }, [id]);

    if (!movie) return <Carregando />

    return (
        <div className='EspacoDetalhes'>
            <div className="EspacoDetalhes">
                <h1>Titulo: {movie.title}</h1>
                <img src={imageURL + movie.poster_path} alt={movie.title} />
                <p>Sinopse: {movie.overview}</p>
            </div>
        </div>
    );
}
