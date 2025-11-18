import { useState, useEffect } from 'react';
import './index.scss'

import { Link } from 'react-router'

import pipoca from '../../assets/images/cinema.png'
import background from '../../assets/images/psdsd.svg';
import foto1 from '../../assets/bg-initial-page/foto1.jpg';
import foto2 from '../../assets/bg-initial-page/foto2.jpg';
import foto3 from '../../assets/bg-initial-page/foto3.jpg';
import foto4 from '../../assets/bg-initial-page/foto4.jpg';
import foto5 from '../../assets/bg-initial-page/foto5.jpg';
import foto6 from '../../assets/bg-initial-page/foto6.jpg';
import foto7 from '../../assets/bg-initial-page/foto7.jpg';
import foto8 from '../../assets/bg-initial-page/foto8.jpg';
import foto9 from '../../assets/bg-initial-page/foto9.jpg';
import foto10 from '../../assets/bg-initial-page/foto10.jpg';
import foto11 from '../../assets/bg-initial-page/foto11.jpg';
import foto12 from '../../assets/bg-initial-page/foto12.jpg';
import foto13 from '../../assets/bg-initial-page/foto13.jpg';
import foto14 from '../../assets/bg-initial-page/foto14.jpg';
import foto15 from '../../assets/bg-initial-page/foto15.jpg';
import foto16 from '../../assets/bg-initial-page/foto16.jpg';
import foto17 from '../../assets/bg-initial-page/foto17.jpg';
import foto18 from '../../assets/bg-initial-page/foto18.jpg';




export default function index() {
    const [fotoAtual, setFotoAtual] = useState(0);
    

    const fotos = [
        foto1, foto2, foto3, foto4, foto5, foto6,
        foto7, foto8, foto9, foto10, foto11, foto12,
        foto13, foto14, foto15, foto16, foto17, foto18
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setFotoAtual((prevIndex) => (prevIndex + 1) % fotos.length);
        }, 7000); 


        return () => clearInterval(interval);
    }, [fotos.length]);


    return (
        <div style={{ 
                backgroundImage: `url(${fotos[fotoAtual]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transition: 'background-image 1s ease-in-out' 
            }}  
        className='container_fundo_home'>
            
            <div className="alinhador">
                <div className="lado_esquerdo">
                    <h4>BEM-VINDO DE VOLTA!</h4>
                    <h1>CULTBRIDGE</h1>
                    <h3>ONDE AS SUAS IDEIAS ENCONTRAM SENTIDO</h3>
                    <div className="AlinhadorBotoes">

                        <Link id='Criar' to={'/comunidade'}>CRIAR COMUNIDADE</Link>

                        <Link id='Navegar' to={'/filmes'}>NAVEGAR</Link>
                    </div>
                </div>
                <div className="lado_direito">
                    <img width={270} src={pipoca} alt="" />
                </div>
            </div>
        </div >
    )
}
