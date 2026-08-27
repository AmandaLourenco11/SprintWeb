const UltimosArquivos = ({ arquivos }) => {
  return (
    <>
      <div className="secao">
        <div className="secao-header">
          <h3>Últimos arquivos</h3>
        </div>

        {arquivos.map((arquivo) => (
          <div className="item" key={arquivo.id}>
            <div className="item-esq">
              <span className={`item-icone ${arquivo.cor}`}>
                {arquivo.icone}
              </span>

              <div>
                <div className="nome">{arquivo.nome}</div>

                <div className="detalhe">
                  {arquivo.materia} · {arquivo.data}
                </div>
              </div>
            </div>

            <span className="chevron">›</span>
          </div>
        ))}

        <a href="/materias" className="ver-todos">
          Ver todas →
        </a>
      </div>
    </>
  );
};

export default UltimosArquivos