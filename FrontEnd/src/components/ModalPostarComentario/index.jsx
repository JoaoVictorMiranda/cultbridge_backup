import './index.scss'

export default function ModalPostarComentario({ tema, salvar, abrir, fechar, conteudo }) {
    if (abrir) return (
        <div className="JanelaFlutuante">
            <div className="Alinhador">
                <header>
                    <h3>{tema}</h3>
                </header>
                <div className="Conteudo">
                    {conteudo}
                    <div className="Botoes">
                        <button id='Cancelar' onClick={fechar}>Cancelar</button>
                        <button onClick={salvar}>Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}