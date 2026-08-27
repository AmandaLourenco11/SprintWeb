import { Link } from "react-router-dom"

const AcessoRapido = ({itens}) => {
  return (
    <>
      <div className="secao-header">
        <h2 className="titulo-secao">Acesso rápido</h2>
        <Link to="/materias" className="ver-todos">
          Ver todos
        </Link>
      </div>

      <div className="acesso-rapido">
        {itens.map((item) => (
          <Link to={item.link} className="acesso-item" key={item.id}>
            <span className={`acesso-icone ${item.cor}`}>{item.icone}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  )
}

export default AcessoRapido
