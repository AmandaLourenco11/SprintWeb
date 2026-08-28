import { Link } from "react-router-dom";

const NavMobile = () => {
  return (
    <nav className="nav-mobile">
      <Link to="/" className="ativo">
        <span className="nav-icone">🏠︎</span>
        <span>Início</span>
      </Link>

      <Link to="/materias">
        <span className="nav-icone">📖</span>
        <span>Matérias</span>
      </Link>

      <Link to="/camera" className="nav-camera">
        <span className="nav-icone-camera">📷</span>
      </Link>

      <Link to="/calendario">
        <span className="nav-icone">📝</span>
        <span>Tarefas</span>
      </Link>

      <Link to="/perfil">
        <span className="nav-icone">👤</span>
        <span>Perfil</span>
      </Link>
    </nav>
  );
};

export default NavMobile;