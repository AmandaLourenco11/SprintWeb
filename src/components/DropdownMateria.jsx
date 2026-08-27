import React from 'react'

const DropdownMateria = ({dropdown, materias, onCompartilhar, onRenomear, onExcluir}) => {
    if (!dropdown) {
    return null;
    }
    
  return (
    <>
      <div
      className="dropdownMenu visivel"
      style={{
        position: "absolute",
        top: dropdown.top,
        left: dropdown.left
      }}
    >
      <button
        className="dropItem"
        onClick={() =>
          onCompartilhar(dropdown.id)
        }
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />

          <line
            x1="8.59"
            y1="13.51"
            x2="15.42"
            y2="17.49"
          />

          <line
            x1="15.41"
            y1="6.51"
            x2="8.59"
            y2="10.49"
          />
        </svg>

        Tornar pasta compartilhada
      </button>

      <button
        className="dropItem"
        onClick={() => {
          const materia = materias.find(
            (m) => m.id === dropdown.id
          );

          if (materia) {
            onRenomear(materia);
          }
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />

          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>

        Renomear
      </button>

      <button className="dropItem dropDanger" onClick={() =>
          onExcluir(dropdown.id)
        }
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="3 6 5 6 21 6" />

          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />

          <path d="M10 11v6" />

          <path d="M14 11v6" />

          <path d="M9 6V4h6v2" />
        </svg>

        Excluir matéria
      </button>
    </div>
    </>
  )
}

export default DropdownMateria

