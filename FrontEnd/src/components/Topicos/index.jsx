import './index.scss'

export default function DefinirTopico({ tema }) {
    return (
        <div className="Alinhador">
            <div className="Titulo">
                {tema}
            </div>
            <div className="Bloco" />
        </div>
    )
}