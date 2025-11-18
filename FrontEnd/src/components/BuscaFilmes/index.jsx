import { Link } from 'react-router-dom';
import './index.scss';

export default function BuscarFilme({ filme }) {
    const poster = filme.poster_path
        ? `https://image.tmdb.org/t/p/w200${filme.poster_path}`
        : '/imagem-não-encontrada.png';

    return (
        <Link to={`/movie/${filme.id}`} className="BuscarFilmeCard">
            <div className="poster">
                <img width={140} src={poster} alt={filme.title} />
            </div>
            <div className="informacoes">
                <h2>{filme.title}</h2>
                <p>{filme.overview || 'Nenhuma descrição informada.'}</p>
            </div>
        </Link>
    );
}