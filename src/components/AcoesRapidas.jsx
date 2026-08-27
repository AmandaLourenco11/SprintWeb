
const AcoesRapidas = ({ abrirCriarAnotacao, abrirSeletorArquivo, importarDrive, importarNotion}) => {
  return (
    <>
      <section className="acoesRapidas">
        <h2>Ações Rápidas</h2>

        <div className="acoesGrid">
            <button className="acaoCard" onClick={abrirCriarAnotacao}>
                <span className="acaoIcone">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                </span>

                <strong>Anotações</strong>
                <span className="acaoDescricao">Crie e organize <br />suas ideias</span>
                <span className="acaoSeta">→</span>
            </button>

            <button className="acaoCard" onClick={abrirSeletorArquivo}>
                <span className="acaoIcone">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </span>

                <strong>Enviar arquivo</strong>
                <span className="acaoDescricao">Envie arquivos do <br />seu dispositivo</span>
                <span className="acaoSeta">→</span>
            </button>

            <button className="acaoCard" onClick={importarDrive}>
                <span className="acaoIcone">
                    <img src="" alt="" />
                </span>

                <strong>Google Drive</strong>
                <span className="acaoDescricao">Importe arquivos <br />do Drive</span>
                <span className="acaoSeta">→</span>
            </button>

            <button className="acaoCard" onClick={importarNotion}>
                <span className="acaoIcone">
                    <img src="" alt="" />
                </span>

                <strong>Notion</strong>
                <span className="acaoDescricao">Importe arquivos <br />do Notion</span>
                <span className="acaoSeta">→</span>
            </button>
        </div>
      </section>
    </>
  )
}

export default AcoesRapidas
