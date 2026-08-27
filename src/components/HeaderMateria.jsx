import { Link } from "react-router-dom";

const HeaderMateria = ({ nomeMateria, busca, setBusca }) => {
  return (
    <>
      <section className="headerMateria">
        <Link to="/materias" className="voltarBtn">← Voltar</Link>

        <div className="tituloBusca">
            <h1>{nomeMateria}</h1>

            <div className="campoBuscar">
                <span className="buscaIcone" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>

                <input type="text" placeholder="Buscar Arquivos..." value={busca} onChange={(e) => setBusca(e.target.value)} />

                <button aria-label="Buscar" type="button">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>
            </div>
        </div>
      </section>
    </>
  )
}

export default HeaderMateria
