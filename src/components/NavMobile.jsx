const NavMobile = () => {
  return (
    <>
      <nav className="nav-mobile">
        <a href="/" className="ativo">
            <span className="nav-icone">🏠︎</span>
            <span>Início</span>
        </a>
        <a href="/materias">
            <span className="nav-icone">📖</span>
            <span>Matérias</span>
        </a>
        <a href="/camera" className="nav-camera">
            <span className="nav-icone-camera">📷</span>
        </a>
        <a href="/calendario">
            <span className="nav-icone">📝</span>
            <span>Tarefas</span>
        </a>
        <a href="/perfil">
            <span className="nav-icone">👤</span>
            <span>Perfil</span>
        </a>
        </nav>
    </>
  )
}

export default NavMobile

