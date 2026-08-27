const AcessoRapido = ({itens}) => {
  return (
    <>
      <div className="secao-header">
        <h2 className="titulo-secao">Acesso rápido</h2>
        <a href="/materias" className="ver-todos">
          Ver todos
        </a>
      </div>

      <div className="acesso-rapido">
        {itens.map((item) => (
          <a href={item.link} className="acesso-item" key={item.id}>
            <span className={`acesso-icone ${item.cor}`}>{item.icone}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </>
  )
}

export default AcessoRapido
