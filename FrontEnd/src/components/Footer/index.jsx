import React from 'react';
import { Link } from 'react-router'
import './index.scss';
import InstagramIcon from '../../assets/instagram.svg';
import TikTokIcon from '../../assets/tiktok.svg';
import YoutubeIcon from '../../assets/youtube.svg';

const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  
  const handleSocialMediaClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='container_footer'>
      <div className="footer_content">
        <div className="container_esquerda">
          <div className="container_links">
            <h2>CULTBRIDGE</h2>
            <p>O CultBridge é uma mescla de redes sociais e comunicativas acopladas em uma só interface.</p>
            <div className="icons">
              <div onClick={() => handleSocialMediaClick('https://www.instagram.com/institutonsfatima/')}>
                <img src={InstagramIcon} alt="Instagram" />
              </div>
              <div onClick={() => handleSocialMediaClick('https://www.youtube.com/watch?v=h154ztlslzw&list=PLZAo-GJfQBsGpRZInH93bdSgEANKtoABC')}>
                <img src={YoutubeIcon} alt="YouTube" />
              </div>
            </div>

            <button type='button' onClick={handleBackToTop}>Voltar ao Topo</button>
          </div>
        </div>

        <div className="container_direito">
          <div>
            <h3>Navegar</h3>
            <ul>
              <a onClick={handleBackToTop}>
                <li>Home</li>
              </a>
              <a href='#DestaquesCinema'>
                <li>Em Alta</li>
              </a>
              <a href="#RecomendacoesFilmesSeries">
                <li>Filmes</li>
              </a>
            </ul>
          </div>
          <div>
            <h3>Legal</h3>
            <ul>
              <Link to={'/desenvolvedores'} ><li>Desenvolvedores</li></Link>
              <Link to={'/desenvolvedores'} ><li>Contato</li></Link>
              <Link to={'/privacidade'} ><li>Políticas de Privacidade</li></Link>
            </ul>
          </div>
        </div>

        <div className="container_direitos">
          <p>© Cultbridge. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}

export default Footer