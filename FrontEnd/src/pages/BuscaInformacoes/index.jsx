import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import BuscarFilme from '../../components/BuscaFilmes';
import apiTMDB from '../../apiTMDB';

import './index.scss';

export default function BuscaInformacoes() {
    const location = useLocation();
    const [filmes, setFilmes] = useState([]);

    const params = new URLSearchParams(location.search);
    const termo = params.get('query') || '';

    useEffect(() => {
        async function buscar() {
            if (!termo) return;

            try {
                const resposta = await apiTMDB.get(
                    `/search/movie?query=${encodeURIComponent(termo)}&language=pt-BR&api_key=f1808babc0ad97475bd84c661f37f5b5`
                );

                console.log('URL usada:', resposta.config.url);
                console.log('Filmes encontrados:', resposta.data.results);

                setFilmes(resposta.data.results);
            } catch (erro) {
                console.error('Erro ao buscar filmes:', erro);
            }
        }

        buscar();
    }, [termo]);

    return (
        <div className="ContainerBusca">
            <Header />
            <div className="ResultadosBusca">
                {filmes.length === 0 && <p>Nenhum resultado encontrado.</p>}

                {filmes.map((filme) => (
                    <BuscarFilme key={filme.id} filme={filme} />
                ))}
            </div>

            <Footer />
        </div>
    );
}
