const ListaArquivos = ({ itens, abrirViewer, abrirDropdown }) => {
    function iconeArquivo(item) {
    if (item.tipo === "anotacao") {
      return "📝";
    }

    if (item.tipoArquivo === "pdf") {
      return "📄";
    }

    if (item.tipoArquivo === "imagem") {
      return "🖼️";
    }

    return "📁";
  }

  function formatarData(iso) {
    const d = new Date(iso);

    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  return (
    <>
      <section className="arquivosSecao">
          <div className="arquivosTitulo">
            <h2>Arquivos e anotações</h2>
          </div>

          {itens.length === 0 ? (
            <p className="semArquivos">
              {itens.length === 0 ? "Ainda não há arquivos." : "Nada encontrado pra essa busca."}
            </p>
          ) : (
            <div className="listaArquivos">
              {itens.map((item) => (
                <div key={item.id} className="itemArquivo" onClick={() => abrirViewer(item)}>
                  <div className="arquivoInfo">
                    <div className="arquivoIcone">
                      {item.tipo === "anotacao" ? "📝" : item.tipoArquivo === "pdf" ? "📄" : item.tipoArquivo === "imagem" ? "🖼️" : "📁"}
                    </div>
                    <div className="arquivoTexto">
                      <div className="arquivoNome">{item.nome}</div>
                      <div className="arquivoMeta">
                        <span className={`badgeTipo ${item.tipo === "anotacao" ? "anotacao" : item.tipoArquivo}`}>
                          {item.tipo === "anotacao" ? "Anotação" : item.tipoArquivo}
                        </span>{" "}
                        {formatarData(item.criadoEm)}
                      </div>
                    </div>
                  </div>

                  <div className="itemAcoes">
                    <button className="btnAbrirArquivo"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirViewer(item);
                      }}>
                      Abrir
                    </button>
                    <button
                      className="btnOpcoesArquivo"
                      title="Opções"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirDropdown(item.id, e.currentTarget);
                      }}
                    >
                      &#8942;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
    </>
  )
}

export default ListaArquivos
