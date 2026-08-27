const ProximasProvas = ({ provas }) => {
  return (
    <div className="secao">
      <div className="secao-header">
        <h3>Próximas provas</h3>
      </div>

      {provas.map((prova) => (
        <div className="item" key={prova.id}>
          <div className="item-esq">
            <span className={`item-icone ${prova.cor}`}>
              {prova.icone}
            </span>

            <div>
              <div className="nome">{prova.materia}</div>

              <div className="detalhe">
                {prova.data}
              </div>

              <div className="mini-barra">
                <span style={{ width: `${prova.progresso}%` }}></span>
              </div>
            </div>
          </div>

          <span className="badge">10 dias</span>
        </div>
      ))}

      <a href="/calendario" className="ver-todos">
        Ver todas →
      </a>
    </div>
  );
};

export default ProximasProvas