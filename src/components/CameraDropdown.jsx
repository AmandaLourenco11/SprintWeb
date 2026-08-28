import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const materias = [
  { nome: "Introdução ao Estudo da Língua Portuguesa I", classe: "pink" },
  { nome: "Introdução aos Estudos Clássicos I", classe: "purple" },
  { nome: "Introdução aos Estudos Literários I", classe: "green" },
  { nome: "Elementos de Linguística I", classe: "orange" },
];

const CameraDropdown = ({ aberto, onSelecionarMateria }) => {
  return (
    <div className={`dropdown-menu ${aberto ? "show" : ""}`}>
      {materias.map((materia) => (
        <button key={materia.nome} className={`dropdown-item ${materia.classe}`} onClick={onSelecionarMateria}>
          <span className="dropdown-item-icon">📖</span>
          {materia.nome}
        </button>
      ))}

      <Link to="/" className="dropdown-item blue">
        <span className="dropdown-item-icon app-icon">
          <img src={logo} alt="JOVI Logo" className="dropdown-logo-img" />
        </span>
        Abrir App
      </Link>
    </div>
  );
};

export default CameraDropdown;

