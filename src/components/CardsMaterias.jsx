import { useNavigate } from "react-router-dom";

const CardsMaterias = ({ materias, abrirDropdown }) => {
  const navigate = useNavigate();

  function abrirMateria(id, nome) {
    navigate(
      `/materias/${id}?nome=${encodeURIComponent(nome)}`
    );
  }

  const corFundo = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const mix = (c) => Math.round(c * 0.15 + 255 * 0.85);

    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  };

  return (
    <div className="cardsMaterias">
      {materias.length === 0 ? (
        <p style={{ color: "#888", marginTop: 20 }}>
          Nenhuma matéria cadastrada ainda.
        </p>
      ) : (
        materias.map((materia) => {
          const cor = materia.cor || "#1466ff";
          const bg = corFundo(cor);

          return (
            <div key={materia.id} className="cardMateria" onClick={() =>
                abrirMateria(materia.id, materia.nome)
              }
            >
              <div className="cardTopoRow">

                <svg
                  className="iconeMateria"
                  width="42"
                  height="42"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="48"
                    height="48"
                    rx="12"
                    fill={bg}
                  />

                  <path
                    d="M14 34V16a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v18l-6-3-4 3-4-3-6 3z"
                    fill={cor}
                  />
                </svg>

                <button className="btnOpcoes" title="Opções" onClick={(e) => {
                    e.stopPropagation();
                    abrirDropdown(
                      materia.id,
                      e.currentTarget
                    );
                  }}
                >
                  &#8942;
                </button>

              </div>

              <h3>{materia.nome}</h3>
              <p>{materia.arquivos || 0} arquivo(s)</p>
            
            </div>
          );
        })
      )}
    </div>
  );
};

export default CardsMaterias;