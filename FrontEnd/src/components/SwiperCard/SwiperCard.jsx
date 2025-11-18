import { FaUser } from "react-icons/fa";
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import './SwiperCard.scss'

const imageURL = import.meta.env.VITE_IMG;

const SwiperCard = ({ movie }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="movie_render"
            style={{ cursor: 'pointer' }}
        >
            <img
                id='Posteres'
                src={imageURL + movie.poster_path}
                alt={movie.title}
            />
            <div className="alinhador">
                <div className="lado_esquerdo">
                    <FaUser />
                    <h3>{movie.popularity.toFixed(1)}</h3>
                </div>
                <div className="lado_direito">
                    <FaStar id="Estrelinha" />
                    <h3>{movie.vote_average.toFixed(1)}</h3>
                </div>
            </div>
        </div>
    )
}

export default SwiperCard;
