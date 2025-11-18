import './index.scss'

export default function CardDetalhes({ Icon, Quantidade, Info }) {
    return (
        <div className="Card">
            <div className="Icon">
                <h2>{Icon}</h2>
            </div>
            <div className="Info">
                <h3>{Quantidade ? Quantidade : '0'}</h3>
                <h3>{Info ? Info : 'Carregando...'}</h3>
            </div>
        </div>
    )
}