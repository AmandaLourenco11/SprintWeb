import { useState, useEffect } from "react";

const ViewerEdicaoAnotacao = ({ item, onFechar, onSalvar, onBaixar }) => {
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    if (item) {
      setTexto(item.conteudo || "");
      setEditando(false);
    }
  }, [item]);

  if (!item) {
    return null;
  }

  function salvar() {
    onSalvar(texto);
    setEditando(false);
  }

  return (
    <div className="viewerOverlay aberto">
      <div className="viewerModal">
        <div className="viewerHeader">
          <span className="viewerTitulo">{item.nome}</span>

          <div className="viewerHeaderAcoes">
            {item.tipo === "anotacao" && !editando && (
              <button className="btnEditarViewer btnSecundario" onClick={() => setEditando(true)}>
                Editar
              </button>
            )}

            <button
              className="btnFecharViewer"
              onClick={onFechar}
              title="Fechar"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="viewerCorpo">
          {item.tipo === "anotacao" ? (
            editando ? (
              <div>
                <textarea
                  className="textareaAnotacao"
                  placeholder="Escreva suas anotações aqui..."
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  style={{ minHeight: 260 }}
                />

                <div className="acoesAnotacao">
                  <button className="btnSecundario" onClick={() => setEditando(false)}>
                    Cancelar
                    </button>

                  <button className="btnPrimario" onClick={salvar}>
                    Salvar
                    </button>
                </div>
              </div>
            ) : (
              <p className="viewerTexto">
                {item.conteudo || "(sem conteúdo)"}
              </p>
            )
          ) : item.tipoArquivo === "pdf" ? (
            <iframe className="viewerPDF" src={item.url} title={item.nome}/>
          ) : item.tipoArquivo === "imagem" ? (
            <img className="viewerImagem" src={item.url}alt={item.nome}/>
          ) : (
            <div className="viewerSemDados">
              <span>Não é possível pré-visualizar este tipo de arquivo.</span>

              <button className="btnPrimario viewerDownload" onClick={() => onBaixar(item.id)}>Baixar arquivo</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewerEdicaoAnotacao;